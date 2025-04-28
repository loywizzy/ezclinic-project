package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"

	_ "github.com/lib/pq"
)

var db *sqlx.DB

// ----------------------------- Models -----------------------------
var jwtKey = []byte("your_secret_key")

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type Claims struct {
	EmployeeID string `json:"employee_id"`
	Email      string `json:"email"`
	jwt.RegisteredClaims
}

type Customer struct {
	ID    int    `db:"id" json:"id"`
	Name  string `db:"full_name" json:"name"`
	Phone string `db:"phone" json:"phone"`
	Email string `db:"email" json:"email"`
}

type Position struct {
	ID   string `db:"id"   json:"id"   binding:"required"`
	Name string `db:"name" json:"name" binding:"required"`
}

type Employee struct {
	ID             string     `db:"id" json:"id"`
	Prefix         string     `db:"prefix" json:"prefix"`
	FirstName      string     `db:"first_name" json:"first_name"`
	LastName       string     `db:"last_name" json:"last_name"`
	Nickname       string     `db:"nickname" json:"nickname"`
	PositionID     string     `db:"position_id" json:"position_id"`
	Color          string     `db:"color" json:"color"`
	Salary         float64    `db:"salary" json:"salary"`
	PayDate        *time.Time `db:"pay_date" json:"pay_date"`
	HasSS          bool       `db:"has_social_security" json:"has_social_security"`
	SSID           string     `db:"social_security_id" json:"social_security_id"`
	TaxDeduction   float64    `db:"tax_deduction" json:"tax_deduction"` // <<< แก้จาก tax_duction เป็น tax_deduction
	HourlyRate     float64    `db:"hourly_rate" json:"hourly_rate"`
	OvertimeRate   float64    `db:"overtime_rate" json:"overtime_rate"`
	LeavePersonal  int        `db:"leave_personal" json:"leave_personal"`
	LeaveVacation  int        `db:"leave_vacation" json:"leave_vacation"`
	LeaveSick      int        `db:"leave_sick" json:"leave_sick"`
	Email          string     `db:"email" json:"email"`
	PasswordHash   string     `db:"password_hash" json:"password_hash"`
	Status         bool       `db:"status" json:"status"`
	PaymentChannel string     `db:"payment_channel" json:"payment_channel"`
	AccountType    string     `db:"account_type" json:"account_type"`
	BankName       string     `db:"bank_name" json:"bank_name"`
	AccountNumber  string     `db:"account_number" json:"account_number"`
	BankBranch     string     `db:"bank_branch" json:"bank_branch"`
	ProfileImage   []byte     `db:"profile_image" json:"-"` // ไม่ต้องส่งออกหน้า API
	ImageURL       string     `db:"image_url" json:"image_url"`
	CreatedAt      time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt      time.Time  `db:"updated_at" json:"updated_at"`
}

type PermissionFlags struct {
	View   bool `json:"view" db:"view"`
	Create bool `json:"create" db:"create"`
	Update bool `json:"update" db:"update"`
	Delete bool `json:"delete" db:"delete"`
}

type PermissionRole struct {
	ID          int64           `db:"id" json:"id"`
	Name        string          `db:"name" json:"name"`
	Permissions json.RawMessage `db:"permissions" json:"permissions"` // 👈
}

// ----------------------------- Main -----------------------------
func loginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": "bad request"})
		return
	}

	var emp Employee
	if err := db.Get(&emp,
		`SELECT id,email,password_hash,status
           FROM employees WHERE lower(email)=lower($1)`, req.Email); err != nil {
		c.JSON(401, gin.H{"error": "invalid"})
		return
	}
	log.Printf("Queried: %+v\n", emp)

	if !emp.Status {
		c.JSON(403, gin.H{"error": "disabled"})
		return
	}

	pw := strings.TrimSpace(req.Password)
	if err := bcrypt.CompareHashAndPassword(
		[]byte(emp.PasswordHash), []byte(pw)); err != nil {
		log.Println("Compare error:", err)
		c.JSON(401, gin.H{"error": "invalid"})
		return
	}

	/* ===== create JWT ===== */
	exp := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		EmployeeID: emp.ID,
		Email:      emp.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(exp),
		},
	}
	token, _ := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(jwtKey)
	c.JSON(200, gin.H{"token": token})
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	fmt.Println(string(hash))

	dsn := os.Getenv("DATABASE_URL")
	dsn = strings.Replace(dsn, "sslmode=require", "sslmode=disable", 1)

	var err error
	db, err = sqlx.Connect("postgres", dsn)
	if err != nil {
		log.Fatalln("DB connect error:", err)
	}

	r := gin.Default()
	r.Use(cors.Default())

	r.POST("/login", loginHandler)

	// Serve static uploads so frontend can access images
	r.Static("/uploads", "./uploads")

	r.GET("/debug/employees", func(c *gin.Context) {
		var employees []Employee
		err := db.Select(&employees, `
    SELECT id, prefix, first_name, last_name, nickname, position_id, 
           color, salary, pay_date, has_social_security, social_security_id, 
           tax_deduction, hourly_rate, overtime_rate, leave_personal, 
           leave_vacation, leave_sick, email, password_hash, status, 
           payment_channel, account_type, bank_name, account_number, 
           bank_branch, profile_image, image_url, created_at, updated_at
    FROM employees
`)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, employees)
	})

	schema := `CREATE TABLE IF NOT EXISTS permission_roles (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        permissions JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );`
	if _, err = db.Exec(schema); err != nil {
		log.Fatalln("migrate:", err)
	}

	api := r.Group("/api")
	{
		// customers
		api.GET("/customers", listCustomers)
		api.GET("/customers/:id", getCustomer)
		api.POST("/customers", createCustomer)
		api.PUT("/customers/:id", updateCustomer)
		api.DELETE("/customers/:id", deleteCustomer)

		// positions
		api.GET("/positions", listPositions)
		api.GET("/positions/:id", getPosition)
		api.POST("/positions", createPosition)
		api.PUT("/positions/:id", updatePosition)
		api.DELETE("/positions/:id", deletePosition)

		// employees
		api.GET("/employees", listEmployees)
		api.GET("/employees/:id", getEmployee)
		api.POST("/employees", createEmployee)
		api.PUT("/employees/:id", updateEmployee)
		api.DELETE("/employees/:id", deleteEmployee)

		api.GET("/permissions", listRoles)
		api.GET("/permissions/:id", getRole)
		api.POST("/permissions", createRole)
		api.PUT("/permissions/:id", updateRole)
		api.DELETE("/permissions/:id", deleteRole)
	}

	r.GET("/health", func(c *gin.Context) { c.String(http.StatusOK, "OK") })

	if err := r.Run(":8080"); err != nil {
		log.Fatalln("Server error:", err)
	}
}

/* ------------------------------------------------------------------
   HANDLERS (permission roles)
--------------------------------------------------------------------*/

func listRoles(c *gin.Context) {
	var roles []PermissionRole
	if err := db.Select(&roles, `SELECT id, name, permissions FROM permission_roles ORDER BY id`); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, roles)
}

func getRole(c *gin.Context) {
	id := c.Param("id")
	var role PermissionRole
	if err := db.Get(&role, `SELECT id, name, permissions FROM permission_roles WHERE id=$1`, id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "role not found"})
		return
	}
	c.JSON(http.StatusOK, role)
}

func createRole(c *gin.Context) {
	var role PermissionRole
	if err := c.ShouldBindJSON(&role); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	permJSON, _ := json.Marshal(role.Permissions)
	if err := db.QueryRowx(`INSERT INTO permission_roles (name, permissions) VALUES ($1,$2) RETURNING id`, role.Name, permJSON).Scan(&role.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, role)
}

func updateRole(c *gin.Context) {
	id := c.Param("id")
	var role PermissionRole
	if err := c.ShouldBindJSON(&role); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	permJSON, _ := json.Marshal(role.Permissions)
	if _, err := db.Exec(`UPDATE permission_roles SET name=$1, permissions=$2, updated_at=NOW() WHERE id=$3`, role.Name, permJSON, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	role.ID = func() int64 { i, _ := strconv.ParseInt(id, 10, 64); return i }()
	c.JSON(http.StatusOK, role)
}

func deleteRole(c *gin.Context) {
	id := c.Param("id")
	if _, err := db.Exec(`DELETE FROM permission_roles WHERE id=$1`, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// ----------------------------- Employees Handlers -----------------------------

func listEmployees(c *gin.Context) {
	var list []Employee
	err := db.Select(&list, `
    SELECT id, prefix, first_name, last_name, nickname, position_id, 
           color, salary, pay_date, has_social_security, social_security_id, 
           tax_deduction, hourly_rate, overtime_rate, leave_personal, 
           leave_vacation, leave_sick, email, password_hash, status, 
           payment_channel, account_type, bank_name, account_number, 
           bank_branch, profile_image, image_url, created_at, updated_at
    FROM employees
`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

func getEmployee(c *gin.Context) {
	id := c.Param("id")
	var emp Employee
	err := db.Get(&emp, `SELECT * FROM employees WHERE id=$1`, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}
	c.JSON(http.StatusOK, emp)
}

func createEmployee(c *gin.Context) {
	if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	emp, imgURL, err := parseEmployeeForm(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	emp.ImageURL = imgURL

	// build insert query
	query := `INSERT INTO employees (
        id, prefix, first_name, last_name, nickname, position_id, color, salary, pay_date,
        has_social_security, social_security_id, tax_deduction, hourly_rate, overtime_rate,
        leave_personal, leave_vacation, leave_sick, email, password_hash, status, payment_channel,
        account_type, bank_name, account_number, bank_branch, image_url
      ) VALUES (
        :id, :prefix, :first_name, :last_name, :nickname, :position_id, :color, :salary, :pay_date,
        :has_social_security, :social_security_id, :tax_deduction, :hourly_rate, :overtime_rate,
        :leave_personal, :leave_vacation, :leave_sick, :email, :password_hash, :status, :payment_channel,
        :account_type, :bank_name, :account_number, :bank_branch, :image_url
      )`

	_, err = db.NamedExec(query, emp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusCreated)
}

func updateEmployee(c *gin.Context) {
	id := c.Param("id")
	if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	emp, imgURL, err := parseEmployeeForm(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	emp.ID = id // ensure id from path
	if imgURL != "" {
		emp.ImageURL = imgURL
	}

	query := `UPDATE employees SET
        prefix=:prefix, first_name=:first_name, last_name=:last_name, nickname=:nickname,
        position_id=:position_id, color=:color, salary=:salary, pay_date=:pay_date,
        has_social_security=:has_social_security, social_security_id=:social_security_id,
        tax_deduction=:tax_deduction, hourly_rate=:hourly_rate, overtime_rate=:overtime_rate,
        leave_personal=:leave_personal, leave_vacation=:leave_vacation, leave_sick=:leave_sick,
        email=:email, password_hash=:password_hash, status=:status, payment_channel=:payment_channel,
        account_type=:account_type, bank_name=:bank_name, account_number=:account_number, bank_branch=:bank_branch,
        image_url=COALESCE(:image_url, image_url), updated_at=NOW()
      WHERE id=:id`

	_, err = db.NamedExec(query, emp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func deleteEmployee(c *gin.Context) {
	id := c.Param("id")
	_, err := db.Exec(`DELETE FROM employees WHERE id=$1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// ----------------------------- Helpers -----------------------------

func parseEmployeeForm(c *gin.Context) (Employee, string, error) {
	var emp Employee
	var err error

	emp.ID = c.PostForm("id")
	emp.Prefix = c.PostForm("prefix")
	emp.FirstName = c.PostForm("first_name")
	emp.LastName = c.PostForm("last_name")
	emp.Nickname = c.PostForm("nickname")
	emp.PositionID = c.PostForm("position_id")
	emp.Color = c.PostForm("color")

	emp.Salary, _ = strconv.ParseFloat(c.PostForm("salary"), 64)
	payDateStr := c.PostForm("pay_date")
	if payDateStr != "" {
		t, _ := time.Parse("2006-01-02", payDateStr)
		emp.PayDate = &t
	}

	emp.HasSS = c.PostForm("has_social_security") == "true"
	emp.SSID = c.PostForm("social_security_id")
	emp.TaxDeduction, _ = strconv.ParseFloat(c.PostForm("tax_deduction"), 64)
	emp.HourlyRate, _ = strconv.ParseFloat(c.PostForm("hourly_rate"), 64)
	emp.OvertimeRate, _ = strconv.ParseFloat(c.PostForm("overtime_rate"), 64)
	emp.LeavePersonal, _ = strconv.Atoi(c.PostForm("leave_personal"))
	emp.LeaveVacation, _ = strconv.Atoi(c.PostForm("leave_vacation"))
	emp.LeaveSick, _ = strconv.Atoi(c.PostForm("leave_sick"))

	emp.Email = c.PostForm("email")
	emp.PasswordHash = c.PostForm("password_hash")
	emp.Status = c.PostForm("status") != "false"

	emp.PaymentChannel = c.PostForm("payment_channel")
	emp.AccountType = c.PostForm("account_type")
	emp.BankName = c.PostForm("bank_name")
	emp.AccountNumber = c.PostForm("account_number")
	emp.BankBranch = c.PostForm("bank_branch")

	// handle file
	file, errFile := c.FormFile("profile_image")
	if errFile == nil {
		// save file
		os.MkdirAll("uploads", 0755)
		filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(file.Filename))
		fullPath := filepath.Join("uploads", filename)
		if err := c.SaveUploadedFile(file, fullPath); err != nil {
			return emp, "", err
		}
		imgURL := "/uploads/" + filename
		return emp, imgURL, nil
	}

	return emp, "", err
}

// ----------------------------- Existing Handlers (customers, positions) -----------------------------

// [existing customer & position handlers unchanged; omitted for brevity but kept in file]

// GET /api/customers
func listCustomers(c *gin.Context) {
	var list []Customer
	err := db.Select(&list, `SELECT id, full_name, phone, email FROM customers ORDER BY id`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

// GET /api/customers/:id
func getCustomer(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var cust Customer
	err := db.Get(&cust, `SELECT id, full_name, phone, email FROM customers WHERE id=$1`, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}
	c.JSON(http.StatusOK, cust)
}

// POST /api/customers
func createCustomer(c *gin.Context) {
	var input struct {
		Name  string `json:"name" binding:"required"`
		Phone string `json:"phone" binding:"required"`
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var id int
	err := db.Get(&id,
		`INSERT INTO customers (full_name, phone, email) VALUES ($1, $2, $3) RETURNING id`,
		input.Name, input.Phone, input.Email,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": id})
}

// PUT /api/customers/:id
func updateCustomer(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var input struct {
		Name  string `json:"name" binding:"required"`
		Phone string `json:"phone" binding:"required"`
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := db.Exec(
		`UPDATE customers SET full_name=$1, phone=$2, email=$3 WHERE id=$4`,
		input.Name, input.Phone, input.Email, id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// DELETE /api/customers/:id
func deleteCustomer(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	_, err := db.Exec(`DELETE FROM customers WHERE id=$1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// GET /api/positions
func listPositions(c *gin.Context) {
	var list []Position
	err := db.Select(&list, `SELECT id, name FROM positions ORDER BY id`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

// GET /api/positions/:id
func getPosition(c *gin.Context) {
	id := c.Param("id")
	var pos Position
	err := db.Get(&pos, `SELECT id, name FROM positions WHERE id=$1`, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Position not found"})
		return
	}
	c.JSON(http.StatusOK, pos)
}

// POST /api/positions
func createPosition(c *gin.Context) {
	var input Position
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := db.Exec(
		`INSERT INTO positions (id, name) VALUES ($1, $2)`,
		input.ID, input.Name,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusCreated)
}

// PUT /api/positions/:id
func updatePosition(c *gin.Context) {
	id := c.Param("id")
	var input Position
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := db.Exec(
		`UPDATE positions SET name=$1 WHERE id=$2`,
		input.Name, id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

// DELETE /api/positions/:id
func deletePosition(c *gin.Context) {
	id := c.Param("id")
	_, err := db.Exec(`DELETE FROM positions WHERE id=$1`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var db *sqlx.DB

// Customer model
type Customer struct {
	ID    int    `db:"id" json:"id"`
	Name  string `db:"full_name" json:"name"`
	Phone string `db:"phone" json:"phone"`
	Email string `db:"email" json:"email"`
}

func main() {
	// โหลด .env (ถ้ามี)
	// _ = godotenv.Load()

	// เชื่อมต่อ Database

	dsn := os.Getenv("DATABASE_URL")
	// Replace 'require' with 'disable' in the connection string
	dsn = strings.Replace(dsn, "sslmode=require", "sslmode=disable", 1)
	// ถ้าใช้ Railway และต้องปิด SSL:
	// dsn += "?sslmode=disable"
	var err error
	db, err = sqlx.Connect("postgres", dsn)
	if err != nil {
		log.Fatalln("DB connect error:", err)
	}

	// สร้าง Gin router
	r := gin.Default()

	// เปิด CORS ถ้าต้องเรียกจาก frontend host อื่น
	r.Use(cors.Default())

	// Routes for Customer CRUD
	api := r.Group("/api")
	{
		api.GET("/customers", listCustomers)
		api.GET("/customers/:id", getCustomer)
		api.POST("/customers", createCustomer)
		api.PUT("/customers/:id", updateCustomer)
		api.DELETE("/customers/:id", deleteCustomer)
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.String(http.StatusOK, "OK")
	})

	// รันที่ port 8080
	if err := r.Run(":8080"); err != nil {
		log.Fatalln("Server error:", err)
	}
}

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

package pkg

import (
	"fmt"
	"github.com/fatih/color"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"gorm.io/gorm/logger"
)

// ProjectDatabase 项目数据库
type ProjectDatabase struct {
	gorm.Model
	Author          string `json:"author"`
	Categories      string `json:"categories"`
	DocumentId      string `gorm:"unique" json:"document_id"`
	DocumentType    string `json:"document_type"`
	Location        string `json:"location"`
	MetaDescription string `json:"meta_description"`
	Offices         string `json:"offices"`
	Photographers   string `json:"photographers"`
	Tags            string `json:"tags"`
	Title           string `json:"title"`
	Year            string `json:"year"`
	Bim             bool   `json:"bim"`
	Url             string `json:"url"`
}

type ImageDatabase struct {
	gorm.Model
}

func AddProjectToDatabase(project ResultDetail) *ProjectDatabase {
	//host := os.Getenv("PGHOST")
	//user := os.Getenv("GADA_PGUSER")
	//password := os.Getenv("GADA_PGPASSWORD")
	//dbname := os.Getenv("GADA_PGDBNAME")
	//port := os.Getenv("PGPORT")

	projectDb := ProjectDatabase{
		Author:          project.Author.Name,
		DocumentId:      project.DocumentId,
		DocumentType:    project.DocumentType,
		MetaDescription: project.MetaDescription,
		Title:           project.Title,
		Year:            project.Year,
		Bim:             project.Bim,
		Url:             project.Url,
	}
	ok := false
	str := ""
	str1 := ""
	texts := make([]string, 0)
	nameUrls := make([]NameUrl, 0)

	texts, ok = project.Categories.([]string)
	if ok {
		str = ""
		for _, t := range texts {
			str += t
			str += ","
		}
		projectDb.Categories = str
	}

	nameUrls, ok = project.Categories.([]NameUrl)
	if ok {
		str = ""
		for _, nameUrl := range nameUrls {
			str += nameUrl.Name
			str += ","
		}
		projectDb.Categories = str
	}

	if interfaces, flag := project.Categories.([]interface{}); flag {
		str = ""
		for _, nameUrl := range interfaces {
			if mapSI, flag2 := nameUrl.(map[string]interface{}); flag2 {
				if instance, flag3 := mapSI["name"]; flag3 {
					if str1, ok = instance.(string); ok {
						str += str1
						str += ","
					}
				}
			}
		}
		projectDb.Categories = str
	}

	str = ""
	for _, nameUrl := range project.Tags {
		str += nameUrl.Name
		str += ","
	}
	projectDb.Tags = str

	str = ""
	for _, nameUrl := range project.Offices {
		str += nameUrl.Name
		str += ","
	}
	projectDb.Offices = str

	str, ok = project.Location.(string)
	if ok {
		projectDb.Location = str
	}

	str = ""
	for _, nameUrl := range project.Photographers {
		str += nameUrl.Name
		str += ","
	}
	projectDb.Photographers = str

	host := "192.168.42.57"
	user := "spider"
	password := "nqf3dAHHM@RsrZGt"
	dbname := "spider"
	port := "5432"
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai",
		host, user, password, dbname, port)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)})
	yellow := color.New(color.FgYellow).PrintlnFunc()
	if err != nil {
		yellow("failed to connect database")
		return &projectDb
	}
	// 迁移 schema
	err = db.AutoMigrate(&ProjectDatabase{})
	if err != nil {
		yellow(err.Error())
		return &projectDb
	}
	// 创建
	result := db.Clauses(clause.OnConflict{DoNothing: true}).Create(&projectDb)
	if result.Error != nil {
		yellow(result.Error.Error())
		return &projectDb
	}
	return &projectDb
}

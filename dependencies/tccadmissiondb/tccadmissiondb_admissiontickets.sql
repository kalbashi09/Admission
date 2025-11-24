CREATE DATABASE  IF NOT EXISTS `tccadmissiondb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tccadmissiondb`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tccadmissiondb
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admissiontickets`
--

DROP TABLE IF EXISTS `admissiontickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admissiontickets` (
  `ticket_id` int unsigned NOT NULL AUTO_INCREMENT,
  `ticket_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `is_used` tinyint(1) DEFAULT '0',
  `date_used` datetime DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  UNIQUE KEY `ticket_code` (`ticket_code`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admissiontickets`
--

LOCK TABLES `admissiontickets` WRITE;
/*!40000 ALTER TABLE `admissiontickets` DISABLE KEYS */;
INSERT INTO `admissiontickets` VALUES (21,'h88V0BiRE',1,'2025-11-24 16:32:30'),(22,'d33c9mJqy',0,NULL),(23,'0eEe6pP2i',0,NULL),(24,'9p5lTQ4QS',0,NULL),(25,'jx3OnBW33',0,NULL),(26,'B5rK4C6lw',0,NULL),(27,'yTq0T40sw',0,NULL),(28,'l7KMmK48P',0,NULL),(29,'3ML9TA6Zf',0,NULL),(30,'Ztq2a66TL',0,NULL),(31,'SBho1wi18',0,NULL),(32,'9j5xpk9ew',0,NULL),(33,'MwTz8JI37',0,NULL),(34,'Gvzh361tb',0,NULL),(35,'2kDqe41hK',0,NULL),(36,'443lWpDRu',0,NULL),(37,'f40MycZ8S',0,NULL),(38,'3VT06vcBu',0,NULL),(39,'WJGO0TP22',0,NULL),(40,'Nza8nCI70',0,NULL);
/*!40000 ALTER TABLE `admissiontickets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-24 16:35:09

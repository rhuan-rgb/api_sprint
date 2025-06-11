-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: agenda_sala_senai
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `classroom`
--

DROP TABLE IF EXISTS `classroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classroom` (
  `number` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int NOT NULL,
  PRIMARY KEY (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classroom`
--

LOCK TABLES `classroom` WRITE;
/*!40000 ALTER TABLE `classroom` DISABLE KEYS */;
INSERT INTO `classroom` VALUES ('A1','CONVERSORES',16),('A2','ELETRÔNICA',16),('A3','CLP',16),('A4','AUTOMAÇÃO',20),('A5','METROLOGIA',16),('A6','PNEUMÁTICA/HIDRÁULICA',20),('AJFR','OFICINA DE AJUSTAGEM/FRESAGEM',16),('ALI','LAB. ALIMENTOS',16),('AUTO','OFICINA DE MANUTENÇÃO AUTOMOTIVA',20),('B10','LAB. INFORMÁTICA',16),('B11','LAB. INFORMÁTICA',40),('B12','LAB. INFORMÁTICA',40),('B2','SALA DE AULA',32),('B3','SALA DE AULA',32),('B5','SALA DE AULA',40),('B6','SALA DE AULA',32),('B7','SALA DE AULA',32),('B8','LAB. INFORMÁTICA',20),('B9','LAB. INFORMÁTICA',16),('C1','SALA DE AULA',24),('C2','LAB. DE INFORMÁTICA',32),('C3','SALA DE MODELAGEM VESTUÁRIO',20),('C4','SALA DE MODELAGEM VESTUÁRIO',20),('C5','SALA DE AULA',16),('CNC','OFICINA DE CNC',16),('COEL','OFICINA DE COMANDOS ELÉTRICOS',16),('CORT1','OFICINA DE CORTE - G1',16),('CORT2','OFICINA DE CORTE - G2',16),('D1','SALA MODELAGEM',16),('D2','SALA DE MODELAGEM',20),('D3','SALA DE AULA',16),('D4','SALA DE CRIAÇÃO',18),('ITEL1','OFICINA DE INSTALAÇÕES ELÉTRICAS - G1',16),('ITEL2','OFICINA DE INSTALAÇÕES ELÉTRICAS - G2',16),('MMC','OFICINA DE MANUTENÇÃO MECÂNICA',16),('MONT1','OFICINA DE MONTAGEM - G1',16),('MONT2','OFICINA DE MONTAGEM - G2',16),('MPESP','OFICINA DE MANUTENÇÃO PESPONTO',16),('PESP1','OFICINA DE PESPONTO - G1',16),('PESP2','OFICINA DE PESPONTO - G2',16),('PESP3','OFICINA DE PESPONTO - G3',16),('PRE','OFICINA DE PREPARAÇÃO',16),('SOLD','OFICINA DE SOLDAGEM',16),('TOR','OFICINA DE TORNEARIA',20),('VEST','OFICINA DE VESTUÁRIO',20);
/*!40000 ALTER TABLE `classroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_schedule`
--

DROP TABLE IF EXISTS `log_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_agendamento` int DEFAULT NULL,
  `cpf_usuario` char(11) DEFAULT NULL,
  `sala` char(5) DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  `dias` varchar(255) DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fim` time DEFAULT NULL,
  `data_log` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_schedule`
--

LOCK TABLES `log_schedule` WRITE;
/*!40000 ALTER TABLE `log_schedule` DISABLE KEYS */;
INSERT INTO `log_schedule` VALUES (1,62,'12345678900','A1','2025-06-09','2025-06-09','Seg','14:10:00','15:10:00','2025-06-09 16:12:42'),(2,63,'12345678911','A1','2026-10-10','2026-10-17','Sab','07:30:00','09:30:00','2025-06-11 12:20:09'),(3,64,'12345678911','A1','2026-10-24','2026-10-24','Sab','07:30:00','09:30:00','2025-06-11 12:25:35'),(4,65,'12345678911','A1','2026-10-24','2026-10-24','Sab','07:30:00','09:30:00','2025-06-11 12:28:24'),(5,66,'12345678911','A1','2026-10-24','2026-10-24','Sab','07:30:00','09:30:00','2025-06-11 13:10:54');
/*!40000 ALTER TABLE `log_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule`
--

DROP TABLE IF EXISTS `schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dateStart` date NOT NULL,
  `dateEnd` date NOT NULL,
  `days` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `classroom` char(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `timeStart` time NOT NULL,
  `timeEnd` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`user`),
  KEY `classroom` (`classroom`),
  CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`cpf`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `schedule_ibfk_2` FOREIGN KEY (`classroom`) REFERENCES `classroom` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule`
--

LOCK TABLES `schedule` WRITE;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` VALUES (51,'2025-05-28','2025-05-28','Seg','46067858888','A1','12:04:00','13:04:00'),(52,'2025-05-28','2025-05-28','Seg','46067858888','A2','14:04:00','15:04:00'),(53,'2025-05-28','2025-05-28','Seg','46067858888','A1','16:42:00','17:42:00');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_insert_schedule` AFTER INSERT ON `schedule` FOR EACH ROW BEGIN
    INSERT INTO log_schedule (
        id_agendamento,
        cpf_usuario,
        sala,
        data_inicio,
        data_fim,
        dias,
        hora_inicio,
        hora_fim
    )
    VALUES (
        NEW.id,
        NEW.user,
        NEW.classroom,
        NEW.dateStart,
        NEW.dateEnd,
        NEW.days,
        NEW.timeStart,
        NEW.timeEnd
    );
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `cpf` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`cpf`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('12345678900','1','a@a','a'),('12345678913','$2b$10$U7T1zHlV97dQyuK3ULAgJOXZLvkYI/ofeXOYyvIHfr.c.cxX1Sis6','@1','a'),('12345678915','$2b$10$WLYHb7NIye5bJ9eGx.uhQOxnxcIRjZwiXs3PXIQ2PZyX8WqPsX.Ii','@s','as'),('12345678919','$2b$10$Abxp26Mf.BFtKBfQjTlFquScOiYBj6RYkRA4BMhwCbVS60vl3Rg7m','@jao','jao'),('12345678920','$2b$10$XkHtN/uf1e8gjCHPg9UoZeZNAuKaUqm1WK2dD6YunFvAGjT/az8WW','@teste','teste'),('12345678921','$2b$10$at5wJAP1nVlrSP3PgYJsU.R35Chw9zjNTVfNGfZXE/ZnHnr3HLyuK','@teste1','teste1'),('12345678922','$2b$10$V0mJLTOyzeOU1YI2c/THYOCHlF5ZQ9GZ/AY5KduZ5DpI.8ZJZAdoe','@x','ax'),('12345678999','$2b$10$o4nkUHlmYZYk3RMIQsPDmeXCLca5DES6ptNogCq/FiZEVTmtEtbGW','@ß;íbíðí','ax'),('12345680091','1234','euler.ferreira19@gmail.com','Euller Silva'),('46067858888','1234','eu@eu','Euller Ferreira');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'agenda_sala_senai'
--

--
-- Dumping routines for database 'agenda_sala_senai'
--
/*!50003 DROP FUNCTION IF EXISTS `contar_reservas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `contar_reservas`(user_cpf CHAR(11)) RETURNS int
    DETERMINISTIC
BEGIN
    DECLARE total INT;

    SELECT COUNT(*) INTO total
    FROM `schedule`
    WHERE `user` COLLATE utf8mb4_unicode_ci = user_cpf COLLATE utf8mb4_unicode_ci;

    RETURN total;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deletar_agendamento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deletar_agendamento`(IN p_id INT)
BEGIN
    DECLARE existe INT;

    -- Verifica se o agendamento existe
    SELECT COUNT(*) INTO existe
    FROM schedule
    WHERE id = p_id;

    IF existe > 0 THEN
        DELETE FROM schedule WHERE id = p_id;
        SELECT CONCAT('Agendamento com ID ', p_id, ' foi deletado.') AS status;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Agendamento não encontrado.';
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-11 12:56:44

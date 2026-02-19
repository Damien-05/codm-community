-- Script d'initialisation MySQL pour CODM Community
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS codm_community CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE codm_community;

-- Cette base sera gérée par les migrations Knex
SELECT 'Base de données initialisée avec succès' as message;

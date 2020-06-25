-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2020 at 02:54 PM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online-doctor`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(10) UNSIGNED NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_hour` varchar(255) CHARACTER SET utf8 NOT NULL,
  `appointment_minute` varchar(56) CHARACTER SET utf8 NOT NULL,
  `patient_id` int(10) UNSIGNED NOT NULL,
  `doctor_id` int(10) UNSIGNED NOT NULL,
  `rate` float DEFAULT NULL,
  `status` int(10) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `appointment_date`, `appointment_hour`, `appointment_minute`, `patient_id`, `doctor_id`, `rate`, `status`, `created_at`, `updated_at`) VALUES
(7, '2018-05-26', '18', '00', 16, 25, 2.5, 1, '2018-05-04 13:13:19', '2018-07-20 12:57:35'),
(8, '2018-05-27', '16', '00', 16, 25, 2.5, 0, '2018-05-04 13:14:10', '2018-05-25 18:38:16'),
(9, '2018-05-26', '16', '00', 16, 25, 2.5, 0, '2018-05-04 13:14:11', '2018-05-25 16:19:08'),
(16, '2018-05-19', '13', '30', 16, 25, 2.5, 1, '2018-05-18 15:42:37', '2018-05-25 20:50:04'),
(18, '2018-05-27', '16', '30', 16, 25, 2.5, 0, '2018-05-18 17:49:26', '2018-05-25 18:39:50'),
(20, '2018-05-26', '17', '00', 16, 25, 2.5, 0, '2018-05-25 11:15:17', '2018-05-25 11:15:17'),
(21, '2018-05-26', '17', '00', 16, 25, 2.5, 0, '2018-05-25 11:16:08', '2018-05-25 11:16:08'),
(27, '2018-05-27', '14', '00', 16, 25, 2.5, 0, '2018-05-25 18:41:09', '2018-05-25 18:41:09'),
(28, '2018-05-27', '15', '00', 16, 25, 2.5, 0, '2018-05-25 21:08:44', '2018-05-25 21:08:44'),
(29, '2018-06-09', '13', '30', 16, 27, 2.5, 0, '2018-06-08 15:58:51', '2018-06-08 15:58:51'),
(30, '2018-06-09', '13', '00', 20, 27, 2.5, 1, '2018-06-08 15:59:34', '2018-06-09 13:13:52'),
(31, '2018-06-09', '14', '30', 16, 22, 2.5, 1, '2018-06-08 15:59:58', '2018-12-14 16:45:03'),
(32, '2018-09-15', '12', '00', 32, 8, 2.5, 1, '2018-09-14 20:58:07', '2018-09-14 21:25:32'),
(33, '2018-09-15', '12', '30', 20, 8, 2.5, 1, '2018-09-14 20:58:36', '2018-09-14 21:26:50'),
(34, '2018-09-15', '1', '00', 32, 8, 2.5, 1, '2018-09-14 20:58:50', '2018-09-14 21:26:29'),
(35, '2018-09-17', '22', '30', 32, 25, 2.5, 1, '2018-09-14 21:17:03', '2018-09-14 21:17:03'),
(36, '2018-09-16', '13', '30', 32, 8, 2.5, 0, '2018-09-14 21:27:22', '2018-09-14 21:27:22'),
(37, '2018-09-27', '12', '30', 33, 22, 2.5, 1, '2018-09-16 08:37:03', '2018-12-14 16:49:24'),
(38, '2018-10-01', '15', '30', 32, 25, 2.5, 1, '2018-09-30 13:11:47', '2018-09-30 13:11:47'),
(39, '2018-10-01', '13', '30', 32, 25, 4, 1, '2018-09-30 13:24:00', '2018-11-30 12:33:43'),
(40, '2018-11-23', '18', '00', 32, 25, 0.5, 1, '2018-09-30 13:41:53', '2018-11-28 17:02:48'),
(41, '2018-12-02', '15', '30', 32, 25, 2, 1, '2018-10-01 09:18:27', '2018-12-14 18:38:52'),
(42, '2018-12-31', '23', '00', 32, 25, 1, 1, '2018-10-01 09:20:33', '2019-01-05 19:30:37'),
(43, '2018-12-01', '13', '00', 32, 17, 4.5, 1, '2018-10-01 09:33:20', '2018-12-15 19:37:19'),
(44, '2018-12-01', '15', '00', 32, 22, 4, 1, '2018-10-01 09:35:15', '2018-12-14 16:51:28'),
(45, '2018-10-28', '18', '30', 32, 27, 3.5, 1, '2018-10-01 11:45:11', '2018-12-15 17:03:54'),
(46, '2018-10-29', '18', '30', 32, 30, 2, 1, '2018-10-01 12:13:53', '2018-12-15 17:04:07'),
(47, '2018-11-20', '14', '30', 32, 28, 5, 1, '2018-11-17 16:22:09', '2018-11-28 16:57:36'),
(48, '2018-11-22', '15', '30', 32, 29, 2.5, 0, '2018-11-17 16:23:08', '2018-11-17 16:23:08'),
(49, '2018-11-28', '17', '30', 32, 35, 2.5, 0, '2018-11-17 16:25:25', '2018-11-17 16:25:25'),
(50, '2018-11-29', '18', '30', 32, 31, 2.5, 0, '2018-11-17 16:29:43', '2018-11-17 16:29:43'),
(51, '2018-11-29', '18', '30', 32, 17, 2.5, 0, '2018-11-17 17:48:22', '2018-11-17 17:48:22'),
(52, '2018-11-28', '18', '00', 32, 19, 2.5, 0, '2018-11-17 18:00:26', '2018-11-17 18:00:26'),
(53, '2018-12-15', '15', '30', 32, 22, 5, 1, '2018-12-14 16:53:43', '2018-12-15 19:51:51'),
(54, '2018-12-15', '17', '00', 38, 22, 0.5, 1, '2018-12-14 19:15:46', '2018-12-18 15:05:43'),
(55, '2018-12-20', '18', '30', 38, 19, NULL, 0, '2018-12-14 19:17:51', '2018-12-14 19:17:51'),
(56, '2018-12-16', '21', '30', 32, 22, 5, 1, '2018-12-15 17:06:21', '2018-12-18 15:03:22'),
(57, '2018-12-20', '18', '30', 32, 22, 3, 1, '2018-12-18 15:04:51', '2018-12-21 19:04:18'),
(58, '2018-12-22', '18', '00', 38, 22, 3, 1, '2018-12-18 15:06:07', '2018-12-29 18:37:18'),
(59, '2018-12-22', '13', '30', 32, 22, 5, 1, '2018-12-21 19:35:52', '2018-12-28 16:45:39'),
(60, '2018-12-25', '19', '30', 32, 27, NULL, 0, '2018-12-21 23:16:58', '2018-12-21 23:16:58'),
(61, '2018-12-23', '18', '30', 32, 28, NULL, 0, '2018-12-21 23:52:41', '2018-12-21 23:52:41'),
(62, '2018-12-24', '19', '00', 32, 22, 4, 1, '2018-12-23 13:51:58', '2018-12-28 16:55:07'),
(64, '2018-12-24', '19', '30', 38, 22, 3, 1, '2018-12-23 21:32:31', '2018-12-29 18:37:13'),
(65, '2018-12-25', '14', '30', 38, 8, NULL, 0, '2018-12-23 21:33:24', '2018-12-23 21:33:24'),
(66, '2018-12-29', '12', '30', 32, 22, 3.5, 1, '2018-12-29 12:33:30', '2018-12-29 12:36:46'),
(67, '2019-01-25', '14', '00', 32, 30, NULL, 0, '2019-01-24 10:35:35', '2019-01-24 10:35:35');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(3, 'Anesthesiologists', '2018-04-13 17:48:08', '2018-04-13 17:48:08'),
(4, 'Cardiologists', '2018-04-13 17:48:19', '2018-04-13 17:48:19'),
(5, 'Family Physicians', '2018-04-13 17:48:42', '2018-04-13 17:48:42'),
(6, 'Oncologists', '2018-04-13 17:49:11', '2018-04-13 17:49:11'),
(7, 'Ophthalmologists', '2018-04-13 17:49:23', '2018-04-13 17:49:23'),
(8, 'Osteopaths', '2018-04-13 17:49:35', '2018-04-13 17:49:35'),
(9, 'Pathologists', '2018-04-13 17:51:06', '2018-04-13 17:51:06'),
(12, 'dentist', '2018-04-13 20:02:53', '2018-05-06 04:39:52');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int(10) UNSIGNED NOT NULL,
  `feedback` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_id` int(10) UNSIGNED NOT NULL,
  `doctor_id` int(10) UNSIGNED NOT NULL,
  `appointment_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `feedback`, `patient_id`, `doctor_id`, `appointment_id`, `created_at`, `updated_at`) VALUES
(6, 'hasvdabhdhjabsdvasjdvhashbdjabshdjsdhjbs', 20, 27, NULL, '2018-05-04 13:13:38', '2018-05-14 14:34:20'),
(8, 'hasvdabhdhjabsdvasjdvhashbdjabshdjsdhjbs', 16, 8, NULL, '2018-05-04 13:13:40', '2018-05-12 18:07:11'),
(9, 'hasvdabhdhjabsdvasjdvhashbdjabshdjsdhjbs', 16, 25, NULL, '2018-05-04 13:14:00', '2018-05-04 13:14:00'),
(10, 'hasvdabhdhjabsdvasjdvhashbdjabshdjsdhjbs', 16, 25, NULL, '2018-05-04 13:14:01', '2018-05-04 13:14:01'),
(11, 'hasvdabhdhjabsdvasjdvhashbdjabshdjsdhjbs', 20, 25, NULL, '2018-05-04 13:15:09', '2018-05-04 13:15:09'),
(12, 'hasvdabhdhjabsdvasjdvhashbdjabshdjsdhjbs', 20, 25, NULL, '2018-05-04 13:15:11', '2018-05-04 13:15:11'),
(14, 'hasvdabhdhjabsdvasjdvhashbdjabshdjsdhjbs', 20, 25, NULL, '2018-05-04 13:15:12', '2018-05-04 13:15:12'),
(15, 'hello', 20, 22, NULL, '2018-05-14 14:35:08', '2018-05-14 14:35:08'),
(16, 'professional doctor with great staff', 32, 28, NULL, '2018-11-28 16:57:36', '2018-11-28 16:57:36'),
(17, 'not professional treatment , bad experience', 32, 25, NULL, '2018-11-28 17:02:48', '2018-11-28 17:02:48'),
(18, 'professional doctor with great staff and friendly enviroment', 32, 22, NULL, '2018-12-14 16:51:28', '2018-12-14 16:51:28'),
(19, 'great staff !', 32, 22, NULL, '2018-12-15 16:48:51', '2018-12-15 16:48:51'),
(20, 'great staff', 32, 17, 43, '2018-12-15 19:37:19', '2018-12-15 19:37:19'),
(21, 'great staff!', 32, 22, 53, '2018-12-15 19:51:51', '2018-12-15 19:51:51'),
(22, 'great doctor with friendly enviroment !', 32, 22, 56, '2018-12-18 15:03:22', '2018-12-18 15:03:22'),
(23, 'bad treatment !', 38, 22, 54, '2018-12-18 15:05:43', '2018-12-18 15:05:43'),
(24, 'thank you! great staff great services there', 32, 22, 59, '2018-12-28 16:45:38', '2018-12-28 16:45:38'),
(25, 'bad experience !', 32, 25, 42, '2019-01-05 19:30:37', '2019-01-05 19:30:37');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2018_04_13_182557_create_roles_table', 1),
(2, '2018_04_13_182615_create_categories_table', 1),
(3, '2018_04_13_182625_create_users_table', 1),
(4, '2018_04_13_182653_create_appointments_table', 1),
(5, '2018_04_13_182710_create_feedbacks_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'admin', '2018-04-13 17:15:34', '2018-04-13 17:19:16'),
(2, 'doctor', '2018-04-13 17:15:47', '2018-04-13 17:15:47'),
(4, 'user', '2018-04-13 17:20:16', '2018-04-13 17:20:16');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(56) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `fees` int(11) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `fees`, `image`, `role_id`, `category_id`, `created_at`, `updated_at`) VALUES
(2, 'baselaly', 'basel1@yahoo.com', '$2y$10$nmFs.Qzg1G7KwVZkmSFuLuyL/d.OLHpami2E7XVeU2BD3tcNXiTsK', '0124521452', 'cairo', NULL, '5ad11b69a531f.png', 1, NULL, '2018-04-13 19:04:41', '2018-04-13 19:04:41'),
(5, 'baselaly', 'basel3@yahoo.com', '$2y$10$X2tckuOEMNZSUHAj/q/sDOR.ildo/HcmB5hSRt8XGTQw/yy.BXQ0S', '0124521452', 'cairo', NULL, '5ad11c21a64cb.png', 1, NULL, '2018-04-13 19:07:45', '2018-04-13 19:07:45'),
(8, 'basel', 'basel78@yahoo.com', '$2y$10$1cVRhs6s3zs3D6pv2XnSn.J7H28xC3ZaL6PaZdm6Mxbdcr917wOJu', '01141571496', 'cairo', 50, 'user.png', 2, 4, '2018-04-13 20:05:10', '2018-07-22 22:48:11'),
(10, 'basel', 'basel800@yahoo.com', '$2y$10$mwKnkpfCmkpohGQV5.kc4uLBzd4GBDGXYf3oH2DIeovQ6CCgvcxIC', '0927389473', 'cairo', NULL, 'user.png', 1, NULL, '2018-04-14 07:54:15', '2018-05-05 13:40:28'),
(16, 'basel', 'basel10@yahoo.com', '$2y$10$CZ4DWryMdfYLTWTvYly/MeLDdZ7s2jB/o/4fN.JrX/iyNnpU/m2dy', '0927389473', 'cairo', NULL, 'user.png', 4, NULL, '2018-04-14 08:17:11', '2018-04-14 08:17:11'),
(17, 'dsdasd', 'cxzc@yahoo.com', '$2y$10$fPcIFGPKfztwDY63A4MFJ.QsaC6zGaDvqcCQjtZMirvu2vVMO8QuC', '345345345', 'dasdasdad', 10, 'user.png', 2, 5, '2018-04-28 15:25:17', '2018-04-28 15:25:17'),
(19, 'dasdasd', 'jfksfk@yahoo.com', '$2y$10$mMjvrXdPaMbB6440YzlBX.V8ivOpaNnw62RjWi66PLQcNDBLMVfYe', '78327468234', 'asdasd', 100, 'user.png', 2, 5, '2018-04-29 14:15:32', '2018-07-22 22:49:57'),
(20, 'TESTtest', 'test7877@yahoo.com', '$2y$10$6OSpzrgiws79M9G6clPqseYyTj3VrvkxSJiM23EXanXZvhrZ8Jhsa', '7328462874', 'cairo', NULL, 'user.png', 4, NULL, '2018-04-29 14:36:00', '2018-04-29 14:36:00'),
(22, 'doctor', 'doctor@yahoo.com', '$2y$10$UOrfJdAvej0QCBAP18jNVemsGEeXL5i7gRa4VPq9k0/PP5X1L0CXa', '32487632', 'cairo', 30, 'user.png', 2, 12, '2018-04-29 15:37:04', '2018-11-30 16:02:23'),
(23, 'basel aly', 'basel500@yahoo.com', '$2y$10$EeIepbQAHQ9Pi50lrEiR5OuDKGSodZfE8UPKd/f6.ZS/Ys/rHfex.', '01141571496', 'new cairo', NULL, '5b0c6725a04fc.jpg', 1, NULL, '2018-04-30 05:43:06', '2018-05-28 19:31:33'),
(24, 'baselAly', 'basel8787@yahoo.com', '$2y$10$RBk4qe3XiPmSMsNmNLq7tuFEokeGr4534sIRigddgmx9KbE9Z.4P2', '012876248', 'cairo', NULL, 'user.png', 1, NULL, '2018-04-30 05:46:45', '2018-04-30 05:46:45'),
(25, 'dasdasd', 'TESTDOCTOR@yahoo.com', '$2y$10$lIT8sCb8wdkezhlqXUD2.up2oUt7xHOKUDhiH9vWFm9hy6rXyX0Tm', '324324324324', 'dasdas', 10, 'user.png', 2, 6, '2018-04-30 05:51:52', '2018-04-30 05:51:52'),
(26, 'sadasdas', 'testtesttest@yahoo.com', '$2y$10$TKgiNGqJ.9AXJ9.ljA3D2epo5guS.Y4QtYYuErjrfN0tdV.GJG.ay', '234324324', 'asdasdas', NULL, '5ae6df367aca9.jpg', 1, NULL, '2018-04-30 06:17:42', '2018-04-30 06:17:42'),
(27, 'Basel aly', 'one@yahoo.com', '$2y$10$SvbCR4MH9C2GVaSXHetDH.64BxkOpwKSGYW5EojVMtZHsaWV2IT2C', '0126236534', 'new cairo ,cairo', 50, '5ae8e140ca58e.jpg', 2, 9, '2018-05-01 18:50:56', '2018-06-08 16:36:24'),
(28, 'test', 'ashbdja@yahoo.com', '$2y$10$l/kCBljbdCNmz4lFAri.5eueVJWpP6ikIyftGO9xeDxFP/PVOrTzC', '0215414578', 'caurpoasd', 100, '5b09219c008d9.jpg', 2, 6, '2018-05-26 05:58:04', '2018-05-26 05:58:04'),
(29, 'doctor1', 'doctor1@yahoo.com', '$2y$10$PnZOpzdol4dDDGgF0pXMo.yCqfiYyZf5TGXPri3gSGZwlTsm9WbGu', '138749812', 'cairo', 50, '5b5502937d91d.jpg', 2, 4, '2018-07-22 21:17:55', '2018-07-22 21:17:55'),
(30, 'doctor2', 'doctor2@doctor.com', '$2y$10$4EB8KF8A3KEnAPxfYtYkD.SO0Hx5Ki97RwnStUWhXU.sTUqiIkwe2', '83479834', 'giza', 100, '5b5502cd62ca4.jpg', 2, 4, '2018-07-22 21:18:53', '2018-07-22 21:18:53'),
(31, 'doctor3', 'doctor3@doctor.com', '$2y$10$e./DpbrIwb0aF1yVsvtL..MEiGrkeznakD1sV05rhuxBi88uPTip2', '3894714314', 'new cairo', 150, '5b5502f049278.jpg', 2, 6, '2018-07-22 21:19:28', '2018-07-22 21:19:28'),
(32, 'basel', 'goner@goner.com', '$2y$10$Riw1GW8AhXcC8/ousUmGEuB.WUP8SMQafyOGjSBl43HgE/4dNMBf2', '012412145', 'new cairo', NULL, '5c1408f8c5770.jpg', 4, NULL, '2018-08-03 18:52:30', '2018-12-14 19:48:08'),
(33, 'goner', 'goner1@goner.com', '$2y$10$OHREaIlNLqQMOtvFPlAdYeauZuSFg7wo6HzHVayPj25604bcRLlWS', '012154515487', 'new cairo', NULL, '5b64b2d659391.png', 4, NULL, '2018-08-03 18:53:58', '2018-08-03 18:53:58'),
(34, 'goner2', 'goner4@yahoo.com', '$2y$10$PvqiKadWSo3ks6S3VHdIeOqeGsOQBNF9m5prTZcPuxGucvPO/a/0y', '217368736', 'cairo', NULL, '5b64ebb7f08b5.jpg', 4, NULL, '2018-08-03 19:06:04', '2018-08-03 22:56:39'),
(35, 'doctor test', 'test@yahoo.com', '$2y$10$mcV50QhTROdVG2mKwOSaF.nw2TlJqp0IzL7/X.qwsUEKogZ5.WAZW', '3247236847', 'cairo', 50, 'user.png', 2, 4, '2018-08-20 19:01:14', '2018-08-20 19:01:14'),
(36, 'chealse', 'blues@chealse.com', '$2y$10$olvH4v3zy9fMwTw.UwRpZe9DVizVTHe3DYDCNdO6q1c971HzCPBqu', '01237648732468', 'london', NULL, '5b7c0b465a1c2.jpg', 4, NULL, '2018-08-21 11:53:26', '2018-08-21 11:53:26'),
(37, 'goner', 'goner5@goner.com', '$2y$10$RVp5DELHcEGcPcUS8J6Xb.oRZqx7UhYqLrb1nZnQpdYQjuslH9uCK', '189237981313', 'goner ciry', NULL, '5b7d84ce39a1b.jpg', 4, NULL, '2018-08-22 14:04:27', '2018-08-22 14:44:14'),
(38, 'patient', 'patient@patient.com', '$2y$10$ir0FYYzoF0qCg0HD1C./zOA9438veb.R3jRNAlnSt6EC2vAxu/FQi', '182936912837129312', 'new cairo', NULL, '5c27bf8b8242f.jpg', 4, NULL, '2018-12-14 19:15:00', '2018-12-29 18:40:11'),
(39, 'admin', 'admin@admin.com', '$2y$10$zN..w3yHIbjQD1GK6Xaf.e3ta.NvbFAv6DakHDFRwPRZBrCi/82A2', '9720', 'fYDSW9cbIOCqJUe5UCPv', NULL, 'user.png', 1, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointments_patient_id_foreign` (`patient_id`),
  ADD KEY `appointments_doctor_id_foreign` (`doctor_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `feedbacks_patient_id_foreign` (`patient_id`),
  ADD KEY `feedbacks_doctor_id_foreign` (`doctor_id`),
  ADD KEY `appointment_id` (`appointment_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `users_role_id_foreign` (`role_id`),
  ADD KEY `users_category_id_foreign` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `appointments_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_doctor_id_foreign` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`),
  ADD CONSTRAINT `feedbacks_patient_id_foreign` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

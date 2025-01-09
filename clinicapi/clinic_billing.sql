-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 09, 2025 at 02:25 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clinic_billing`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `description` text DEFAULT NULL,
  `service` enum('Consultation','Surgery','Therapy') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','booked','cancelled','approved') NOT NULL DEFAULT 'pending',
  `cancellation_reason` varchar(255) DEFAULT NULL,
  `payment_status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
  `bill_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `refund_status` enum('none','requested','processed','failed') NOT NULL DEFAULT 'none',
  `insurance_provider` varchar(255) DEFAULT NULL,
  `policy_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `username`, `date`, `time`, `description`, `service`, `created_at`, `status`, `cancellation_reason`, `payment_status`, `bill_amount`, `refund_status`, `insurance_provider`, `policy_number`) VALUES
(11, 3, 'ase', '2025-01-16', '03:00:00', 'wd123', 'Therapy', '2025-01-09 13:20:02', 'approved', NULL, 'paid', 10000.00, 'none', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `insurance_claims`
--

CREATE TABLE `insurance_claims` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insurance_claims`
--

INSERT INTO `insurance_claims` (`id`, `user_id`, `description`, `status`, `created_at`) VALUES
(1, 1, 'Claim for hospital expenses', 'rejected', '2024-12-08 07:39:46'),
(2, 2, 'consultation: sdsfsdf', 'approved', '2024-12-26 02:55:16'),
(3, 6, 'consultation: sakit paa', 'approved', '2025-01-06 12:32:16');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `services` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `user_id`, `services`, `description`, `created_at`) VALUES
(3, 3, NULL, 'Service: Therapy, Description: wd123', '2025-01-09 13:20:31');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `status` enum('pending','paid','failed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `user_id`, `appointment_id`, `amount`, `payment_method`, `status`, `created_at`) VALUES
(11, 2, 26, 100.00, 'credit card', 'paid', '2024-12-23 04:39:12'),
(12, 2, 27, 100.00, 'credit card', 'paid', '2024-12-23 04:41:25'),
(13, 2, 28, 100.00, 'credit card', 'paid', '2024-12-23 05:11:05'),
(20, 2, 55, 50.00, 'credit card', 'paid', '2025-01-03 07:25:29'),
(22, 6, 58, 200.00, 'credit card', 'paid', '2025-01-06 14:43:42'),
(25, 3, 10, 150.00, 'credit card', 'paid', '2025-01-09 12:24:41'),
(26, 3, 11, 10000.00, 'credit card', 'paid', '2025-01-09 13:20:12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `contact_number` varchar(15) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `medical_history` text DEFAULT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `card_first_name` varchar(255) NOT NULL,
  `card_last_name` varchar(255) NOT NULL,
  `card_number` varchar(20) NOT NULL,
  `card_expiry` varchar(7) NOT NULL,
  `card_security_code` varchar(4) NOT NULL,
  `billing_address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `billing_postal_code` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `password`, `created_at`, `contact_number`, `date_of_birth`, `medical_history`, `role`, `card_first_name`, `card_last_name`, `card_number`, `card_expiry`, `card_security_code`, `billing_address`, `city`, `province`, `billing_postal_code`) VALUES
(1, 'admin', 'admin', 'admin', '$2y$10$uSa9VcjLIhfwpkuA2waNL.KCgBa8lRH8inUVYqOEOy4jywV9bm4ai', '2024-12-07 15:04:59', '09926591335', '2003-11-22', NULL, 'admin', 'admin', 'admin', '4111111111111111', '2026-12', '123', '123 Elm St', 'Olongapo', 'Zambales', '2208'),
(3, 'Aschille', 'De Leon', 'ase', '$2y$10$Z21MQefnfYzrUayl9gO0jeMT58EAzTOJvQFIUJmnsERhvWFiq.3ie', '2024-12-20 21:16:53', '09566817487', '2003-05-11', 'asdasdasdasdasdas', 'user', 'Aschille ', 'De Leon ', '4123412312412431231', '2028-12', '123', '123 Elm St, Apt 45', 'Olongapo', 'Zambales', '2208'),
(6, 'Kevin', 'Julhusin', 'kevspogi', '$2y$10$KJf.4MUTK7h3PH2Lo2JiAue5znJE96RPzh1hTY.bjeLLs1ojMjm.S', '2025-01-05 12:54:49', '09566817487', '2003-05-11', 'sakit sa paa', 'user', 'Kevin', 'Julhusin', '4111111111111111111', '2322-12', '123', '123 Elm St, Apt 45', 'Olongapo', 'Castillejos', '2208');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `status` (`status`),
  ADD KEY `payment_status` (`payment_status`),
  ADD KEY `refund_status` (`refund_status`);

--
-- Indexes for table `insurance_claims`
--
ALTER TABLE `insurance_claims`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `insurance_claims`
--
ALTER TABLE `insurance_claims`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

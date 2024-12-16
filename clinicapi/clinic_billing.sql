-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 10, 2024 at 09:27 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

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
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('booked','cancelled') NOT NULL DEFAULT 'booked'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `name`, `date`, `time`, `description`, `created_at`, `status`) VALUES
(12, 9, 'kevin', '2024-12-15', '10:30:00', 'Dental Checkup', '2024-12-10 04:43:40', 'booked'),
(13, 5, 'ac', '2024-03-04', '14:03:00', 'HAHAHA', '2024-12-10 04:52:10', 'booked'),
(14, 4, 'John Doe', '2024-02-23', '02:32:00', 'adhd', '2024-12-10 05:09:23', 'booked'),
(15, 11, 'Hex Cee', '2024-12-25', '17:30:00', 'checkup', '2024-12-10 06:07:56', 'booked'),
(16, 15, 'Ac Gabriel Manalo', '2004-02-21', '15:43:00', 'fasdfasd', '2024-12-10 17:13:30', 'booked'),
(17, 15, 'Ac Gabriel Manalo', '2034-04-23', '15:12:00', 'asdfasafgg', '2024-12-10 17:13:40', 'cancelled'),
(18, 15, 'Ac Gabriel Manalo', '2024-03-04', '16:32:00', '45353456', '2024-12-10 17:13:52', 'booked'),
(19, 15, 'Ac Gabriel Manalo', '2034-03-31', '15:24:00', 'ncxbnc', '2024-12-10 17:14:04', 'cancelled'),
(20, 15, 'Ac Gabriel Manalo', '4322-03-04', '16:23:00', 'ncvmfghjf', '2024-12-10 17:14:11', 'cancelled'),
(21, 15, 'Ac Gabriel Manalo', '3222-03-22', '14:32:00', 'fasfadfgdsvz', '2024-12-10 17:14:39', 'cancelled'),
(22, 15, 'Ac Gabriel Manalo', '0003-02-21', '02:13:00', 'asdfasdfaerfa', '2024-12-10 20:26:26', 'booked');

-- --------------------------------------------------------

--
-- Table structure for table `insurance_claims`
--

CREATE TABLE `insurance_claims` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `insurance_claims`
--

INSERT INTO `insurance_claims` (`id`, `user_id`, `description`, `status`, `created_at`) VALUES
(1, 1, 'Claim for hospital expenses', 'pending', '2024-12-08 07:39:46');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('paid','unpaid') DEFAULT 'unpaid',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `user_id`, `description`, `status`, `created_at`) VALUES
(1, 1, 'Consultation Fee', 'unpaid', '2024-12-08 07:38:10');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,         -- New field for first name
  `last_name` varchar(255) NOT NULL,          -- New field for last name
  `username` varchar(50) NOT NULL,            -- Username field
  `password` varchar(255) NOT NULL,           -- Password field
  `medical_records` text DEFAULT NULL,        -- Medical records (optional)
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),  -- Timestamp when user was created
  `contact_number` varchar(15) NOT NULL,      -- Contact number (with country code, max 15 characters)
  `date_of_birth` date DEFAULT NULL,          -- Date of birth
  `medical_history` text NOT NULL,            -- Medical history
  `role` enum('admin', 'user') NOT NULL DEFAULT 'user',  -- User role (admin or user)

  -- Billing Information Fields
  `card_first_name` varchar(255) NOT NULL,    -- Billing card first name
  `card_last_name` varchar(255) NOT NULL,     -- Billing card last name
  `card_number` varchar(20) NOT NULL,         -- Billing card number
  `card_expiry` varchar(7) NOT NULL,          -- Card expiry in MM/YYYY format
  `card_security_code` varchar(4) NOT NULL,   -- CVV
  `billing_address` varchar(255) NOT NULL,    -- Billing address
  `billing_city` varchar(100) NOT NULL,       -- Billing city
  `billing_state` varchar(100) NOT NULL,      -- Billing state
  `billing_postal_code` varchar(10) NOT NULL, -- Billing postal code
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `medical_records`, `created_at`, `first_name`, `last_name`, `contact_number`, `date_of_birth`, `medical_history`, `role`) 
VALUES
(1, 'admin', '$2y$10$uSa9VcjLIhfwpkuA2waNL.KCgBa8lRH8inUVYqOEOy4jywV9bm4ai', NULL, '2024-12-08 07:04:59', 'ADMINISTRATOR', '', '09926591335', '2003-11-22', '', 'admin'),
(15, 'acgbm', '$2y$10$9FVsrYDLUM7dti3yAY.52OWmGITNM4pSGQPhOV0zHeJrtIbpXJs/2', NULL, '2024-12-10 12:04:12', 'Ac Gabriel', 'Manalo', '09926591335', '2003-11-22', '', 'user');


--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `insurance_claims`
--
ALTER TABLE `insurance_claims`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `insurance_claims`
--
ALTER TABLE `insurance_claims`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `insurance_claims`
--
ALTER TABLE `insurance_claims`
  ADD CONSTRAINT `insurance_claims_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

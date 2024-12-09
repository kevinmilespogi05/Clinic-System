-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2024 at 06:13 PM
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
  `date` date NOT NULL,
  `time` time NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `user_id`, `date`, `time`, `description`, `created_at`) VALUES
(1, 5, '2024-12-10', '10:00:00', 'General checkup', '2024-12-09 15:00:27'),
(2, 5, '2024-12-10', '10:00:00', 'General checkup', '2024-12-09 15:10:17'),
(4, 10, '2024-12-25', '10:00:00', NULL, '2024-12-09 15:54:02'),
(5, 10, '2024-02-11', '08:00:00', NULL, '2024-12-09 15:58:50'),
(6, 10, '2024-11-22', '07:45:00', NULL, '2024-12-09 16:12:37'),
(7, 10, '2025-11-22', '19:00:00', NULL, '2024-12-09 16:16:01'),
(8, 10, '2323-02-11', '12:32:00', NULL, '2024-12-09 16:29:47'),
(9, 10, '2322-02-23', '02:32:00', NULL, '2024-12-09 16:33:45'),
(10, 10, '0000-00-00', '02:32:00', 'adhd', '2024-12-09 16:37:24'),
(11, 10, '2122-12-31', '14:32:00', 'I need eye checkup', '2024-12-09 16:37:51');

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
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `medical_records` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(255) NOT NULL,
  `contact_number` varchar(20) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `medical_history` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `medical_records`, `created_at`, `name`, `contact_number`, `date_of_birth`, `medical_history`) VALUES
(1, 'admin', '$2y$10$V9trfojqYAFNUBT.lMkf5eCUMzowF6R4P7tNvc29zh6Pm3IfFizVS', NULL, '2024-12-08 07:04:59', 'John Doe', '1234567890', '1990-01-01', ''),
(2, 'john_doe', '$2y$10$N.DGZx3EHgTSBg5EWeIDheYrbfTjHVirlwWeiEUX.lg75B8EN0v3W', 'Allergic to penicillin.', '2024-12-08 07:29:13', '', '', NULL, ''),
(3, 'acgabriel', '$2y$10$Da3TEt/jmHQ8fHN5yh1eQefRsv27QuffZLFV..PooYctNm0sNaWk2', NULL, '2024-12-08 11:07:24', 'Ac Gabriel', '', NULL, 'No known allergies. Previous surgery in 2015.'),
(4, 'johndoe', '$2y$10$3bso9jc3i3Hw5ZgAZYwXgeYrmmlt0THcZoa.nr2rrWugeXpXA2nHq', NULL, '2024-12-08 12:08:31', 'John Doe', '1234567890', '1990-01-01', 'No known conditions'),
(5, 'ac22', '$2y$10$.af5wH7IPoP5yiWrnmnrp.KNXmxVmmgnZKiVv7G60H2qUUijIXK4q', NULL, '2024-12-08 13:58:41', 'ac', '09926591335', '2003-11-22', ''),
(6, 'ladyjohan', '$2y$10$Ln8DvG4AcusY6bpwRzUWg.fClKJF57eU4GmJo2W8UceGaNViHfMCS', NULL, '2024-12-08 14:05:48', 'Lady Johan Canapate', '09389077792', '2004-09-30', ''),
(7, 'hex', '$2y$10$83BXTgejWJnxFOtlwrRe3OxJUxly6jdNLXOvrEvQxIE8KqeT6OPIi', NULL, '2024-12-08 14:30:14', 'HexsuDane', '09389077792', '2004-09-30', ''),
(8, 'kevinhindipogi', '$2y$10$T/BtQV9apWwP2F4PH1lBheviREiOB/FT8wNzwkpm0/JuJMu59m/kW', NULL, '2024-12-09 03:09:28', 'kevin', '0912312312', '2003-02-23', ''),
(9, 'johnkevin', '$2y$10$c5yrcd2TNbZ0fr9g0sFHTuwu3x2pmfPhHFUBeLqVU7h0unOgRpg5u', NULL, '2024-12-09 03:23:17', 'kevin', '1234567890', '1990-01-01', ''),
(10, 'LJ', '$2y$10$zH0rBop6n/ALb46klQ2BQeYkRDoXRueCncbPNvS5COg5Z5D.xmp4O', NULL, '2024-12-09 09:27:14', 'Lady Johan Canapate', '09389077792', '2004-09-30', '');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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

@ -3,7 +3,7 @@
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 10, 2025 at 06:21 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

@ -46,95 +46,6 @@ CREATE TABLE `appointments` (
  `invoice_generated` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `appointment_id` int(11) NOT NULL,
  `services` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `user_id`, `appointment_id`, `services`, `description`, `created_at`) VALUES
(15, 3, 20, NULL, 'Service: Surgery, Description: 123', '2025-01-10 05:17:14'),
(16, 3, 21, NULL, 'Service: Surgery, Description: 123', '2025-01-10 05:18:19');

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
(3, 'Aschille', 'De Leon', 'ase', '$2y$10$Z21MQefnfYzrUayl9gO0jeMT58EAzTOJvQFIUJmnsERhvWFiq.3ie', '2024-12-20 21:16:53', '09566817487', '2003-05-11', 'Headache', 'user', 'Aschille ', 'De Leon ', '4123 4123 1241 2431 ', '2028-12', '123', '123 Elm St, Apt 45', 'Olongapo', 'Zambales', '2208');

--
-- Indexes for dumped tables
--
@ -149,32 +60,6 @@ ALTER TABLE `appointments`
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
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `appointment_id` (`appointment_id`);

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
@ -183,31 +68,7 @@ ALTER TABLE `users`
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `insurance_claims`
--
ALTER TABLE `insurance_claims`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

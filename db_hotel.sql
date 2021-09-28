-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 28, 2021 at 03:09 AM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_hotel`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', '$2y$12$m.lzO1smItLyrBe0zuUjWOQ3yqP6IIuQCvewlaYwAxF3FGOKNwxR6', '2021-08-03 21:27:59', '2021-08-03 21:27:59');

-- --------------------------------------------------------

--
-- Table structure for table `charges`
--

CREATE TABLE `charges` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` double NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `charges`
--

INSERT INTO `charges` (`id`, `order_id`, `title`, `amount`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Extra', 5000, '2021-09-04 06:37:08', '2021-09-04 06:37:09'),
(2, 1, 'Person', 10000, '2021-09-10 08:43:45', '2021-09-10 08:43:45');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `room` int(11) NOT NULL,
  `rate` double NOT NULL,
  `rate_type` varchar(255) NOT NULL,
  `discount` int(11) NOT NULL,
  `from_datetime` datetime NOT NULL,
  `to_datetime` datetime NOT NULL,
  `checkin` time NOT NULL,
  `checkout` time NOT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL,
  `reasons` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `product_id`, `room`, `rate`, `rate_type`, `discount`, `from_datetime`, `to_datetime`, `checkin`, `checkout`, `status_id`, `reasons`, `createdAt`, `updatedAt`) VALUES
(1, 2, 4, 1, 5000, 'per night', 0, '2021-09-05 14:00:00', '2021-09-06 12:00:00', '14:00:00', '12:00:00', 2, NULL, '2021-09-02 03:42:43', '2021-09-02 03:42:43'),
(2, 1, 1, 1, 2500, 'Per Night', 0, '2021-09-07 14:00:00', '2021-09-09 12:00:00', '14:00:00', '12:00:00', 3, NULL, '2021-09-04 06:17:50', '2021-09-04 06:17:51'),
(3, 1, 1, 1, 2500, 'Per Night', 0, '2021-09-29 14:00:00', '2021-10-01 12:00:00', '14:00:00', '12:00:00', 1, NULL, '2021-09-10 02:31:58', '2021-09-10 02:31:58'),
(4, 1, 4, 2, 5000, 'per night', 0, '2021-09-22 14:00:00', '2021-09-25 12:00:00', '14:00:00', '12:00:00', 2, NULL, '2021-09-19 02:00:15', '2021-09-19 02:00:15');

-- --------------------------------------------------------

--
-- Table structure for table `order_status`
--

CREATE TABLE `order_status` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `order_status`
--

INSERT INTO `order_status` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Pending', '2021-07-28 01:01:13', '2021-07-28 01:01:13'),
(2, 'Ongoing', '2021-07-28 01:01:13', '2021-07-28 01:01:13'),
(3, 'Completed', '2021-07-28 01:01:13', '2021-07-28 01:01:13'),
(4, 'Declined', '2021-07-28 01:01:13', '2021-07-28 01:01:13'),
(5, 'Cancelled', '2021-07-28 01:01:13', '2021-07-28 01:01:13');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `category` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `facility` varchar(255) NOT NULL,
  `entry` int(11) NOT NULL,
  `rate` double NOT NULL,
  `rate_type` varchar(255) NOT NULL,
  `room_availability` int(11) NOT NULL,
  `images` longtext NOT NULL,
  `discount` int(11) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `store_id`, `category`, `name`, `facility`, `entry`, `rate`, `rate_type`, `room_availability`, `images`, `discount`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'AROOM', 'A1ROOM', 'Free Wi-Fi;Shower;Kitchenette;Executive lounge access;City View;1 Double Bed', 2, 2500, 'Per Night', 5, 'http://localhost/hotelimages/productimages/1630465351244.png', 0, '2021-08-04 22:02:15', '2021-08-04 22:02:15'),
(2, 1, 'BROOM', 'B1ROOM', 'City View;1 Single Bed and 1 Double Bed', 3, 3000, 'Per Night', 5, 'http://localhost/hotelimages/productimages/1630465351244.png', 0, '2021-08-04 22:08:36', '2021-08-04 22:08:36'),
(4, 1, 'AROOM', 'AROOM KING SIZE', 'FREE WIFI;FREE CONDOM', 2, 5000, 'per night', 2, 'http://localhost/hotelimages/productimages/1630465351244.png', 0, '2021-09-01 03:02:31', '2021-09-01 03:02:31'),
(5, 1, 'AROOM', 'jahsdkasdh', 'lksadja;skldajsd;123vajskd;asdklajs', 3, 200, 'per night', 5, 'http://localhost/hotelimages/productimages/1632017208465.png', 0, '2021-09-19 02:06:48', '2021-09-19 02:06:48');

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `store_id` bigint(20) UNSIGNED NOT NULL,
  `rate` double NOT NULL,
  `comment` longtext NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `wallet` double NOT NULL,
  `type` varchar(255) NOT NULL,
  `checkin` time NOT NULL,
  `checkout` time NOT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `images` longtext NOT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `email`, `password`, `mobile`, `name`, `wallet`, `type`, `checkin`, `checkout`, `address`, `latitude`, `longitude`, `images`, `status_id`, `createdAt`, `updatedAt`) VALUES
(1, 'sophiered@gmail.com', '$2b$10$coc5/ds90YtdIb1GjGNmleb6yfO6UOaqTeYhBOM7zwyvC3VH9V9SG', '09263989364', 'Sophie Red Hotel and Onshore Restaurant', 15000, 'Hotel;Resort', '14:00:00', '12:00:00', 'Bobuntugan, Butuan - Cagayan de Oro - Iligan Rd, Bayan ng Jasaan, Lalawigan ng Misamis Oriental', 8.664244097620175, 124.74051466399814, 'http://localhost/hotelimages/storeimages/1630461115634.png', 1, '2021-08-03 22:09:07', '2021-09-09 05:54:20'),
(6, 'arjeresort@gmail.com', '$2b$10$ajE5fbY7kTf0yr/E5IXsh.NB4Ltm6Kj/prgiMw5GBB7QvTjejDda2', '', 'Arje Resort', 0, 'Resort', '07:00:29', '19:00:00', 'Jasaan', 8.63701, 124.766946, '', 1, '2021-08-27 11:34:51', '2021-08-27 11:34:51');

-- --------------------------------------------------------

--
-- Table structure for table `store_status`
--

CREATE TABLE `store_status` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `store_status`
--

INSERT INTO `store_status` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Enable', '2021-08-27 04:07:43', '2021-08-27 04:07:43'),
(2, 'Disable', '2021-08-27 04:07:43', '2021-08-27 04:07:43');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `store_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `amount` double NOT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `user_id`, `store_id`, `order_id`, `name`, `amount`, `status_id`, `createdAt`, `updatedAt`) VALUES
(1, 2, NULL, 1, 'Downpayment', 2500, 3, '2021-09-02 03:42:43', '2021-09-02 03:42:43'),
(2, 1, 1, 2, 'Downpayment', 2500, 3, '2021-09-04 06:17:51', '2021-09-04 06:17:51'),
(5, 1, 1, 2, 'Pay thru wallet payment', 7500, 3, '2021-09-04 06:44:24', '2021-09-04 06:44:24'),
(6, 1, NULL, NULL, 'Cash out to wallet', 5000, 7, '2021-09-09 05:36:17', '2021-09-09 05:36:17'),
(7, 1, NULL, NULL, 'Cash in to wallet', 200, 6, '2021-09-09 05:38:22', '2021-09-09 05:38:22'),
(8, 1, NULL, NULL, 'Cash in to wallet', 300, 6, '2021-09-09 05:40:00', '2021-09-09 05:40:00'),
(12, NULL, 1, NULL, 'Cash out to wallet', 1000, 7, '2021-09-09 05:54:20', '2021-09-09 05:54:20'),
(13, 1, NULL, NULL, 'Cash out to wallet', 500, 7, '2021-09-09 06:02:53', '2021-09-09 06:02:53'),
(14, 1, NULL, NULL, 'Cash in to wallet', 2000, 6, '2021-09-10 01:18:48', '2021-09-10 01:18:48'),
(15, 1, NULL, 3, 'Downpayment', 2500, 1, '2021-09-10 02:31:58', '2021-09-10 02:31:58'),
(16, 1, NULL, NULL, 'Cash out to wallet', 4500, 7, '2021-09-10 03:17:49', '2021-09-10 03:17:49'),
(17, 1, NULL, NULL, 'Cash in to wallet', 5000, 6, '2021-09-10 07:59:31', '2021-09-10 07:59:31'),
(18, 1, NULL, NULL, 'Cash in to wallet', 50000, 6, '2021-09-19 02:00:01', '2021-09-19 02:00:01'),
(19, 1, 1, 4, 'Downpayment', 15000, 3, '2021-09-19 02:00:15', '2021-09-19 02:00:15');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_status`
--

CREATE TABLE `transaction_status` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transaction_status`
--

INSERT INTO `transaction_status` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'On Hold', '2021-08-15 17:50:20', '2021-08-15 17:50:20'),
(2, 'Added', '2021-08-15 17:50:20', '2021-08-15 17:50:20'),
(3, 'Deducted', '2021-08-15 17:50:20', '2021-08-15 17:50:20'),
(4, 'Cancelled', '2021-08-18 18:09:52', '2021-08-18 18:09:52'),
(5, 'Declined', '2021-08-18 18:20:51', '2021-08-18 18:20:51'),
(6, 'Cash In', '2021-08-18 18:09:52', '2021-08-18 18:09:52'),
(7, 'Cash Out', '2021-08-18 18:20:51', '2021-08-18 18:20:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `wallet` double NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `mobile` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstname`, `lastname`, `wallet`, `username`, `email`, `email_verified_at`, `mobile`, `mobile_verified_at`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'Reuel Dave', 'Cardines', 40000, 'kabzko14', 'rdcardines@gmail.com', '2021-07-28 05:34:13', '09262397184', '2021-07-28 05:34:24', '$2b$10$coc5/ds90YtdIb1GjGNmleb6yfO6UOaqTeYhBOM7zwyvC3VH9V9SG', '2021-07-27 19:00:31', '2021-09-19 02:00:01'),
(2, 'Maria Nita', 'Calvo', 7500, 'mayen.calvo', 'calvomn@gmail.com', NULL, '', NULL, '$2b$10$CFGqU38B6BylWI8r8AuaZO1gicAFoHH/Gki.ZdNgT97Le3XmIEika', '2021-08-23 08:34:52', '2021-08-23 08:34:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `charges`
--
ALTER TABLE `charges`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_id` (`order_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `store_status`
--
ALTER TABLE `store_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `transaction_status`
--
ALTER TABLE `transaction_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `mobile` (`mobile`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `charges`
--
ALTER TABLE `charges`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_status`
--
ALTER TABLE `order_status`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `store_status`
--
ALTER TABLE `store_status`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `transaction_status`
--
ALTER TABLE `transaction_status`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `charges`
--
ALTER TABLE `charges`
  ADD CONSTRAINT `charges_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `order_status` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `transaction_status` (`id`),
  ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `transactions_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_ibfk_5` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

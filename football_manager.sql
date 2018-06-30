-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 30, 2018 at 09:19 PM
-- Server version: 10.1.32-MariaDB
-- PHP Version: 7.2.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `football_manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `managers`
--

CREATE TABLE `managers` (
  `id` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `email` varchar(255) NOT NULL,
  `joined` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `country` varchar(3) NOT NULL,
  `verified` tinyint(4) NOT NULL,
  `reset_token` text NOT NULL,
  `token_expires` datetime NOT NULL,
  `api_token` text NOT NULL,
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `managers`
--

INSERT INTO `managers` (`id`, `name`, `email`, `joined`, `country`, `verified`, `reset_token`, `token_expires`, `api_token`, `password`) VALUES
(4, 'ahmed dinar', 'testme@gmail.com', '2018-06-30 18:33:52', '', 0, '345b44efb8d49785578c0a84c71885512c768f15', '2018-07-04 00:33:52', '', '$2a$10$qp3OmrSmqVsud/.pjOfu8e2UMlseg8AgXXpoAgLztFmF5s05Zojcq');

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `position` varchar(50) NOT NULL,
  `rating` decimal(10,0) NOT NULL,
  `salary` varchar(100) NOT NULL,
  `tid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `players`
--

INSERT INTO `players` (`id`, `name`, `position`, `rating`, `salary`, `tid`) VALUES
(3, 'Cristiano Ronaldo', 'forward', '94', '21 Million', 3),
(4, 'Marcelo Vieira', 'Defender', '87', ' 10 Million', 3),
(5, 'Toni Kroos', 'Midfielder', '90', '10.4 million', 3);

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `origin` varchar(40) NOT NULL,
  `net_worth` varchar(100) NOT NULL,
  `mid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `origin`, `net_worth`, `mid`) VALUES
(3, 'Real Madrid', 'spain', '370 Million', 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `managers`
--
ALTER TABLE `managers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `managers`
--
ALTER TABLE `managers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

CREATE DATABASE IF NOT EXISTS wnc_final_project;

USE wnc_final_project;

CREATE TABLE user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255),
  password VARCHAR(255),
  role ENUM ('CUSTOMER', 'TELLER', 'ADMIN'),
  status VARCHAR(255) DEFAULT 'ACTIVE',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE refreshtoken (
  id INT PRIMARY KEY AUTO_INCREMENT,
  refreshToken VARCHAR(255),
  userId INT,
  FOREIGN KEY (userId) REFERENCES user(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE customer (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullName VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  otp VARCHAR(255),
  otpExpiredAt DATETIME,
  userId INT,
  FOREIGN KEY (userId) REFERENCES user(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE teller(
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullName VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  userId INT,
  FOREIGN KEY (userId) REFERENCES user(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE paymentaccount (
  id INT PRIMARY KEY AUTO_INCREMENT,
  accountNumber VARCHAR(255),
  balance DECIMAL(15, 2),
  customerId INT,
  FOREIGN KEY (customerId) REFERENCES customer(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE beneficiaries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  shortName VARCHAR(100),
  bankName VARCHAR(255),
  accountNumber VARCHAR(255),
  customerId INT,
  FOREIGN KEY (customerId) REFERENCES customer(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE paymenttransaction (
  id INT PRIMARY KEY AUTO_INCREMENT,
  amount DECIMAL(15, 2),
  content VARCHAR(255),
  otp VARCHAR(255),
  otpExpiredAt DATETIME,
  status VARCHAR(50),
  srcAccount VARCHAR(255),
  srcBankName VARCHAR(255),
  desAccount VARCHAR(255),
  desBankName VARCHAR(255),
  fee DECIMAL (15, 2),
  feePayer ENUM ('RECEIVER', 'SENDER'),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE debits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  amount DECIMAL(15, 2),
  content VARCHAR(255),
  status VARCHAR(50),
  cancelReason VARCHAR(255),
  paymentTransactionsId INT,
  creditor INT,
  debtor INT,
  FOREIGN KEY (paymentTransactionsId) REFERENCES paymenttransaction(id),
  FOREIGN KEY (creditor) REFERENCES customer(id),
  FOREIGN KEY (debtor) REFERENCES customer(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE partners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bankName VARCHAR(255),
  domain VARCHAR(255),
  partenerPublicKey TEXT,
  partenerAlgo TEXT,
  partenerSecretKey TEXT,
  ourPrivateKey TEXT,
  ourPublicKey TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE notification (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  message TEXT,
  isRead BOOLEAN DEFAULT FALSE,
  customerId INT,
  relatedDebitUrl VARCHAR(255),
  FOREIGN KEY (customerId) REFERENCES customer(id),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dữ liệu mẫu cho bảng User
INSERT INTO `user` (`username`, `password`, `role`, `status`)
VALUES 
  ('john_doe', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'CUSTOMER', 'ACTIVE'), -- password: password123
  ('jane_smith', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'TELLER', 'ACTIVE'),
  ('admin_user', '$2a$10$LSmPnaHK5j/23kxMutw4U.DctTLN6Ju/e3H9MU1vh/cn0EOcZYc6.', 'ADMIN', 'ACTIVE'), -- password: admin123
  ('mike_williams', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'CUSTOMER', 'ACTIVE'),
  ('emily_jones', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'CUSTOMER', 'ACTIVE'),
  ('lisa_white', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'CUSTOMER', 'ACTIVE'),
  ('tom_brown', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'CUSTOMER', 'ACTIVE'),
  ('lucy_black', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'CUSTOMER', 'ACTIVE'),
  ('susan_green', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'CUSTOMER', 'ACTIVE'),
  ('boon_real','$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6','CUSTOMER', 'ACTIVE'),
  ('david_yellow', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'CUSTOMER', 'ACTIVE'),
  ('boonreal', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'CUSTOMER', 'ACTIVE'),
  ('rose', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'TELLER', 'ACTIVE'),
  ('ronaldo', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'CUSTOMER', 'ACTIVE');

-- Dữ liệu mẫu cho bảng Teller
INSERT INTO `teller` (`fullName`, `email`, `phone`, `userId`)
VALUES
  ('Jane Smith', 'jane.smith@example.com', '052-521-6319', 2),
  ('Rose', 'rose@example.com', '097-245-2119', 13);


-- Dữ liệu mẫu cho bảng Customer (otp và otpExpiredAt để trống)
INSERT INTO `customer` (`fullName`, `email`, `phone`, `otp`, `otpExpiredAt`, `userId`)
VALUES
  ('John Doe', 'john.doe@example.com', '012-345-6789', NULL, NULL, 1),
  ('Mike Williams', 'mike.williams@example.com', '011-223-3445', NULL, NULL, 4),
  ('Emily Jones', 'emily.jones@example.com', '022-334-4556', NULL, NULL, 5),
  ('Lisa White', 'lisa.white@example.com', '033-445-5667', NULL, NULL, 6),
  ('Tom Brown', 'tom.brown@example.com', '044-556-6778', NULL, NULL, 7),
  ('Lucy Black', 'lucy.black@example.com', '055-667-7889', NULL, NULL, 8),
  ('Susan Green', 'susan.green@example.com', '066-778-8990', NULL, NULL, 9),
  ('Boon Real', 'boonreal@example.com','111-222-3333',NULL,NULL,10),
  ('David Yellow', 'david.yellow@example.com', '077-889-9001', NULL, NULL, 11),
  ('Cris Ronaldo', 'cr7@gmail.com','123-456-7890',NULL,NULL,14);

-- Dữ liệu mẫu cho bảng PaymentAccount (thêm dấu gạch ngang vào accountNumber)
INSERT INTO `paymentaccount` (`accountNumber`, `balance`, `customerId`)
VALUES
  ('123456789012', 10000.00, 1),
  ('987654321098', 5000.00, 2),
  ('112233445566', 3000.00, 3),
  ('998877665544', 1500.00, 4),
  ('667788990011', 7000.00, 5),
  ('889900112233', 2000.00, 6),
  ('988877665544', 4000.00, 7),
  ('878765447897', 5000.00, 9),
  ('667788980010', 7000.00, 10);

-- Dữ liệu mẫu cho bảng Beneficiaries (chỉ có bankName là 'OWN_BANK' hoặc 'BANK A')
INSERT INTO `beneficiaries` (`name`, `shortName`, `bankName`, `accountNumber`, `customerId`)
VALUES
  ('Alice Johnson', 'Alice', 'BANK A', '1230001234', 1),
  ('Bob Brown', 'Bob', 'OWN_BANK', '9870009876', 4),
  ('Charlie White', 'Charlie', 'BANK A', '3330003333', 5),
  ('David Green', 'David', 'OWN_BANK', '4440004444', 6),
  ('Eve Blue', 'Eve', 'BANK A', '5550005555', 7),
  ('Frank Grey', 'Frank', 'OWN_BANK', '6660006666', 8),
  ('Grace Yellow', 'Grace', 'BANK A', '7770007777', 9);

-- Dữ liệu mẫu cho bảng PaymentTransaction (status dùng tiếng Việt)
INSERT INTO `paymenttransaction` (`amount`, `content`, `otp`, `otpExpiredAt`, `status`, `srcAccount`, `srcBankName`, `desAccount`, `desBankName`, `fee`, `feePayer`)
VALUES
  (1000.00, 'Thanh toán dịch vụ', '123456', '2024-12-12 12:00:00', 'ĐANG XỬ LÝ', '123456789012', 'Bank A', '9870009876', 'Bank B', 100.00, 'RECEIVER'),
  (500.00, 'Thanh toán hàng hóa', '654321', '2024-12-12 13:00:00', 'HOÀN THÀNH', '987654321098', 'Bank B', '1230001234', 'Bank A', 120.00, 'RECEIVER'),
  (1500.00, 'Thanh toán hóa đơn', '234567', '2024-12-12 14:00:00', 'ĐANG XỬ LÝ', '112233445566', 'Bank C', '3330003333', 'Bank C', 200.00, 'SENDER'),
  (2000.00, 'Thanh toán cho đối tác', '345678', '2024-12-12 15:00:00', 'HOÀN THÀNH', '667788990011', 'Bank D', '4440004444', 'Bank D', 130.00, 'RECEIVER'),
  (2500.00, 'Thanh toán dịch vụ công', '456789', '2024-12-12 16:00:00', 'ĐANG XỬ LÝ', '889900112233', 'Bank E', '5550005555', 'Bank E', 120.00, 'RECEIVER'),
  (3000.00, 'Thanh toán dịch vụ bổ sung', '567890', '2024-12-12 17:00:00', 'ĐANG XỬ LÝ', '123456789012', 'Bank A', '6660006666', 'Bank F', 100.00, 'SENDER'),
  (4000.00, 'Thanh toán đầu tư', '678901', '2024-12-12 18:00:00', 'HOÀN THÀNH', '987654321098', 'Bank B', '7770007777', 'Bank G', 110.00, 'RECEIVER'),
  (1200.00, 'Thanh toán nội bộ', '789012', '2024-12-12 19:00:00', 'HOÀN THÀNH', '1230001234', 'Bank A', '123456789012', 'Bank A', 220.00, 'SENDER'),
  (800.00, 'Thanh toán phí dịch vụ', '890123', '2024-12-12 20:00:00', 'ĐANG XỬ LÝ', '667788990011', 'Bank D', '987654321098', 'Bank B', 90.00, 'RECEIVER'),
  (950.00, 'Thanh toán phí bảo trì', '901234', '2024-12-12 21:00:00', 'HOÀN THÀNH', '889900112233', 'Bank E', '112233445566', 'Bank C', 85.00, 'SENDER'),
  (1100.00, 'Thanh toán phí vận chuyển', '012345', '2024-12-12 22:00:00', 'ĐANG XỬ LÝ', '123456789012', 'Bank A', '667788990011', 'Bank D', 95.00, 'RECEIVER'),
  (1300.00, 'Thanh toán phí bảo hiểm', '123456', '2024-12-12 23:00:00', 'HOÀN THÀNH', '987654321098', 'Bank B', '889900112233', 'Bank E', 105.00, 'SENDER'),
  (1400.00, 'Thanh toán phí dịch vụ', '234567', '2024-12-13 00:00:00', 'ĐANG XỬ LÝ', '112233445566', 'Bank C', '123456789012', 'Bank A', 115.00, 'RECEIVER'),
  (1600.00, 'Thanh toán phí bảo trì', '345678', '2024-12-13 01:00:00', 'HOÀN THÀNH', '998877665544', 'Bank C', '987654321098', 'Bank B', 125.00, 'SENDER'),
  (1700.00, 'Thanh toán phí vận chuyển', '456789', '2024-12-13 02:00:00', 'ĐANG XỬ LÝ', '667788990011', 'Bank D', '112233445566', 'Bank C', 135.00, 'RECEIVER'),
  (1800.00, 'Thanh toán phí bảo hiểm', '567890', '2024-12-13 03:00:00', 'HOÀN THÀNH', '889900112233', 'Bank E', '998877665544', 'Bank C', 145.00, 'SENDER'),
  (1900.00, 'Thanh toán phí dịch vụ', '678901', '2024-12-13 04:00:00', 'ĐANG XỬ LÝ', '123456789012', 'Bank A', '987654321098', 'Bank B', 155.00, 'RECEIVER'),
  (2100.00, 'Thanh toán phí bảo trì', '789012', '2024-12-13 05:00:00', 'HOÀN THÀNH', '987654321098', 'Bank B', '667788990011', 'Bank D', 165.00, 'SENDER'),
  (2200.00, 'Thanh toán phí vận chuyển', '890123', '2024-12-13 06:00:00', 'ĐANG XỬ LÝ', '112233445566', 'Bank C', '889900112233', 'Bank E', 175.00, 'RECEIVER'),
  (2300.00, 'Thanh toán phí bảo hiểm', '901234', '2024-12-13 07:00:00', 'HOÀN THÀNH', '998877665544', 'Bank C', '123456789012', 'Bank A', 185.00, 'SENDER'),
  (2400.00, 'Thanh toán phí dịch vụ', '012345', '2024-12-13 08:00:00', 'ĐANG XỬ LÝ', '123456789012', 'Bank A', '998877665544', 'Bank C', 195.00, 'RECEIVER'),
  (2500.00, 'Thanh toán phí bảo trì', '123456', '2024-12-13 09:00:00', 'HOÀN THÀNH', '987654321098', 'Bank B', '667788990011', 'Bank D', 205.00, 'SENDER'),
  (2600.00, 'Thanh toán phí vận chuyển', '234567', '2024-12-13 10:00:00', 'ĐANG XỬ LÝ', '112233445566', 'Bank C', '889900112233', 'Bank E', 215.00, 'RECEIVER'),
  (2700.00, 'Thanh toán phí bảo hiểm', '345678', '2024-12-13 11:00:00', 'HOÀN THÀNH', '998877665544', 'Bank C', '123456789012', 'Bank A', 225.00, 'SENDER'),
  (2800.00, 'Thanh toán phí dịch vụ', '456789', '2024-12-13 12:00:00', 'ĐANG XỬ LÝ', '123456789012', 'Bank A', '987654321098', 'Bank B', 235.00, 'RECEIVER'),
  (2900.00, 'Thanh toán phí bảo trì', '567890', '2024-12-13 13:00:00', 'HOÀN THÀNH', '987654321098', 'Bank B', '667788990011', 'Bank D', 245.00, 'SENDER'),
  (3000.00, 'Thanh toán phí vận chuyển', '678901', '2024-12-13 14:00:00', 'ĐANG XỬ LÝ', '112233445566', 'Bank C', '889900112233', 'Bank E', 255.00, 'RECEIVER'),
  (3100.00, 'Thanh toán phí bảo hiểm', '789012', '2024-12-13 15:00:00', 'HOÀN THÀNH', '998877665544', 'Bank C', '123456789012', 'Bank A', 265.00, 'SENDER'),
  (1000.00, 'Transaction 1', '123456', '2024-12-14 10:00:00', 'HOÀN THÀNH', '988877665544', 'Bank A', '112233445566', 'Bank B', 130.00, 'SENDER'),
  (2000.00, 'Transaction 2', '123457', '2024-12-14 11:00:00', 'HOÀN THÀNH', '112233445566', 'Bank B', '988877665544', 'Bank A', 230.00, 'RECEIVER'),
  (1500.00, 'Transaction 3', '123458', '2024-12-14 12:00:00', 'HOÀN THÀNH', '988877665544', 'Bank A', '223344556677', 'Bank C', 135.00, 'SENDER'),
  (2500.00, 'Transaction 4', '123459', '2024-12-14 13:00:00', 'HOÀN THÀNH', '223344556677', 'Bank C', '988877665544', 'Bank A', 235.00, 'RECEIVER'),
  (3000.00, 'Transaction 5', '123460', '2024-12-14 14:00:00', 'HOÀN THÀNH', '988877665544', 'Bank A', '334455667788', 'Bank D', 330.00, 'SENDER'),
  (3500.00, 'Transaction 6', '123461', '2024-12-14 15:00:00', 'HOÀN THÀNH', '334455667788', 'Bank D', '988877665544', 'Bank A', 335.00, 'RECEIVER'),
  (4000.00, 'Transaction 7', '123462', '2024-12-14 16:00:00', 'HOÀN THÀNH', '988877665544', 'Bank A', '445566778899', 'Bank E', 430.00, 'SENDER'),
  (4500.00, 'Transaction 8', '123463', '2024-12-14 17:00:00', 'HOÀN THÀNH', '445566778899', 'Bank E', '988877665544', 'Bank A', 435.00, 'RECEIVER'),
  (1100.00, 'Transaction 1', '223456', '2024-12-15 10:00:00', 'HOÀN THÀNH', '878765447897', 'Bank B', '556677889900', 'Bank F', 131.00, 'SENDER'),
  (2100.00, 'Transaction 2', '223457', '2024-12-15 11:00:00', 'HOÀN THÀNH', '556677889900', 'Bank F', '878765447897', 'Bank B', 231.00, 'RECEIVER'),
  (1600.00, 'Transaction 3', '223458', '2024-12-15 12:00:00', 'HOÀN THÀNH', '878765447897', 'Bank B', '667788990011', 'Bank G', 136.00, 'SENDER'),
  (2600.00, 'Transaction 4', '223459', '2024-12-15 13:00:00', 'HOÀN THÀNH', '667788990011', 'Bank G', '878765447897', 'Bank B', 236.00, 'RECEIVER'),
  (3100.00, 'Transaction 5', '223460', '2024-12-15 14:00:00', 'HOÀN THÀNH', '878765447897', 'Bank B', '778899001122', 'Bank H', 331.00, 'SENDER'),
  (3600.00, 'Transaction 6', '223461', '2024-12-15 15:00:00', 'HOÀN THÀNH', '778899001122', 'Bank H', '878765447897', 'Bank B', 336.00, 'RECEIVER'),
  (4100.00, 'Transaction 7', '223462', '2024-12-15 16:00:00', 'HOÀN THÀNH', '878765447897', 'Bank B', '889900112233', 'Bank I', 431.00, 'SENDER'),
  (4600.00, 'Transaction 8', '223463', '2024-12-15 17:00:00', 'HOÀN THÀNH', '889900112233', 'Bank I', '878765447897', 'Bank B', 436.00, 'RECEIVER'),
  (1200.00, 'Transaction 1', '323456', '2024-12-16 10:00:00', 'HOÀN THÀNH', '667788980010', 'Bank C', '990011223344', 'Bank J', 132.00, 'SENDER'),
  (2200.00, 'Transaction 2', '323457', '2024-12-16 11:00:00', 'HOÀN THÀNH', '990011223344', 'Bank J', '667788980010', 'Bank C', 232.00, 'RECEIVER'),
  (1700.00, 'Transaction 3', '323458', '2024-12-16 12:00:00', 'HOÀN THÀNH', '667788980010', 'Bank C', '001122334455', 'Bank K', 137.00, 'SENDER'),
  (2700.00, 'Transaction 4', '323459', '2024-12-16 13:00:00', 'HOÀN THÀNH', '001122334455', 'Bank K', '667788980010', 'Bank C', 237.00, 'RECEIVER'),
  (3200.00, 'Transaction 5', '323460', '2024-12-16 14:00:00', 'HOÀN THÀNH', '667788980010', 'Bank C', '112233445566', 'Bank L', 332.00, 'SENDER'),
  (3700.00, 'Transaction 6', '323461', '2024-12-16 15:00:00', 'HOÀN THÀNH', '112233445566', 'Bank L', '667788980010', 'Bank C', 337.00, 'RECEIVER'),
  (4200.00, 'Transaction 7', '323462', '2024-12-16 16:00:00', 'HOÀN THÀNH', '667788980010', 'Bank C', '223344556677', 'Bank M', 432.00, 'SENDER'),
  (4700.00, 'Transaction 8', '323463', '2024-12-16 17:00:00', 'HOÀN THÀNH', '223344556677', 'Bank M', '667788980010', 'Bank C', 437.00, 'RECEIVER');

-- Dữ liệu mẫu cho bảng Debits
INSERT INTO `debits` (`amount`, `content`, `status`, `cancelReason`, `paymentTransactionsId`, `creditor`, `debtor`)
VALUES
  (1000.00, 'Debit Transaction 1', 'Completed', NULL, 1, 1, 4),
  (500.00, 'Debit Transaction 2', 'Pending', NULL, 2, 4, 5);
  
  
-- Dữ liệu mẫu cho bảng Partners
INSERT INTO `partners` (`bankName`, `domain`, `partenerPublicKey`, `partenerAlgo`, `partenerSecretKey`, `ourPrivateKey`, `ourPublicKey`)
VALUES
('MyBank',
'localhost:80',
'-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZmjCPLjynjYv5OReKswNxdszz
vvdVnPwqp26U4Z3EpIgor/pi8tBdwpGnZmQ8dafanIsCwxA46Lva1LANLhmRnY7Q
b0qH79r8EPZnCzW2353j+G1uOJM47JVg3n3qrwNwQvlKjFxuHOr9h4wqkOxMQloz
D7eACpVqe7MGH5XYnwIDAQAB
-----END PUBLIC KEY-----', 'PGP', 'SecretKey',
'-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQDSSPoLNzgQurpAYGmV2vr2tg1/rnHlA4WCR1LWbxSpotBVKrMH
ABy3QcoPaUeZJRK/qGTPCgcLS+Zo2PI9aMWm9VruTua0bq5dNBUoFI86bsx5VIEz
qUlu9KOjne2wIFzWmdv+XP+Ixvook+NpnssHqlrPt3bGMwK559qSayYOWwIDAQAB
AoGAJ4y+KnnaO5tDCHSZpyumY9xdsZP3q+D7rUMI23fM5RLQKBR902U8AWOIQ1nD
s5P7cLyVKTNzm7ZMwY98D/yyn5qRMm8wQ8yxB4wneYqSRGbyTYo9lPywhWHXXTB8
3n4OHvliBPdPPc+d3NKyg1BlgXwoWnVLEPLqHXyzlJUuh6ECQQD8whodoFlAUgb9
RYOiDoU4S6fb0febu6DCUpE6/2mhFNs/IxxoFvkDpRax+oM0bFO0NMKhYYMR+fXJ
8jYU3uI5AkEA1Ptrd3W7Eq3UbJT0iDCPeJNq0bgZJ7u0JQJLQV3eQjUPgr6Q7fed
3kF/CIM22yuyTpY7qG6bG3zQxN59TXLlMwJBAKSQB4rUdGeRQGWz1aE0TP47G73d
9ZVaUq9SLKY51t7+gkSYKo2Gr3f1C1KzZKtEADdqxnFl2H1ivelOnnF2L9kCQQDE
bKQuZnwDvCG/ipkDyZVoJL1NcbZxeKGpyDXTsVi8QudtM4fCkK4ePtWD6k/7To+B
/vhCXM/cR/7asj9p4F8VAkEA19SS8xF6BoVvcTZQcbK6JpRS0tFip8mQHYEmZq+O
78F21Nx50ei9a5DgOs7Jpxq1cp9g3oCINVb53CCVrTvlRw==
-----END RSA PRIVATE KEY-----',
'-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDSSPoLNzgQurpAYGmV2vr2tg1/
rnHlA4WCR1LWbxSpotBVKrMHABy3QcoPaUeZJRK/qGTPCgcLS+Zo2PI9aMWm9Vru
Tua0bq5dNBUoFI86bsx5VIEzqUlu9KOjne2wIFzWmdv+XP+Ixvook+NpnssHqlrP
t3bGMwK559qSayYOWwIDAQAB
-----END PUBLIC KEY-----'),
('GROUP2',
'localhost:3000',
'-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZmjCPLjynjYv5OReKswNxdszz
vvdVnPwqp26U4Z3EpIgor/pi8tBdwpGnZmQ8dafanIsCwxA46Lva1LANLhmRnY7Q
b0qH79r8EPZnCzW2353j+G1uOJM47JVg3n3qrwNwQvlKjFxuHOr9h4wqkOxMQloz
D7eACpVqe7MGH5XYnwIDAQAB
-----END PUBLIC KEY-----', 'RSA', 'SecretKey',
'-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQDSSPoLNzgQurpAYGmV2vr2tg1/rnHlA4WCR1LWbxSpotBVKrMH
ABy3QcoPaUeZJRK/qGTPCgcLS+Zo2PI9aMWm9VruTua0bq5dNBUoFI86bsx5VIEz
qUlu9KOjne2wIFzWmdv+XP+Ixvook+NpnssHqlrPt3bGMwK559qSayYOWwIDAQAB
AoGAJ4y+KnnaO5tDCHSZpyumY9xdsZP3q+D7rUMI23fM5RLQKBR902U8AWOIQ1nD
s5P7cLyVKTNzm7ZMwY98D/yyn5qRMm8wQ8yxB4wneYqSRGbyTYo9lPywhWHXXTB8
3n4OHvliBPdPPc+d3NKyg1BlgXwoWnVLEPLqHXyzlJUuh6ECQQD8whodoFlAUgb9
RYOiDoU4S6fb0febu6DCUpE6/2mhFNs/IxxoFvkDpRax+oM0bFO0NMKhYYMR+fXJ
8jYU3uI5AkEA1Ptrd3W7Eq3UbJT0iDCPeJNq0bgZJ7u0JQJLQV3eQjUPgr6Q7fed
3kF/CIM22yuyTpY7qG6bG3zQxN59TXLlMwJBAKSQB4rUdGeRQGWz1aE0TP47G73d
9ZVaUq9SLKY51t7+gkSYKo2Gr3f1C1KzZKtEADdqxnFl2H1ivelOnnF2L9kCQQDE
bKQuZnwDvCG/ipkDyZVoJL1NcbZxeKGpyDXTsVi8QudtM4fCkK4ePtWD6k/7To+B
/vhCXM/cR/7asj9p4F8VAkEA19SS8xF6BoVvcTZQcbK6JpRS0tFip8mQHYEmZq+O
78F21Nx50ei9a5DgOs7Jpxq1cp9g3oCINVb53CCVrTvlRw==
-----END RSA PRIVATE KEY-----',
'-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDSSPoLNzgQurpAYGmV2vr2tg1/
rnHlA4WCR1LWbxSpotBVKrMHABy3QcoPaUeZJRK/qGTPCgcLS+Zo2PI9aMWm9Vru
Tua0bq5dNBUoFI86bsx5VIEzqUlu9KOjne2wIFzWmdv+XP+Ixvook+NpnssHqlrP
t3bGMwK559qSayYOWwIDAQAB
-----END PUBLIC KEY-----');

-- Dữ liệu mẫu cho bảng Notification
INSERT INTO `notification` (`title`, `message`, `isRead`, `customerId`)
VALUES
  ('Thông báo 1', 'Thông báo quan trọng', FALSE, 1),
  ('Thông báo 2', 'Cập nhật dịch vụ', TRUE, 4),
  ('Thông báo 3', 'Bảo trì hệ thống', FALSE, 5),
  ('Thông báo 4', 'Khuyến mãi mới', TRUE, 6),
  ('Thông báo 5', 'Cập nhật hệ thống', FALSE, 7);

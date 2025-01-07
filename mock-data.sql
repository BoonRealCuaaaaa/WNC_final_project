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
  ('rose', '$2b$10$HgmvOCVc5plm2zysO4NkDuKn0RNclHIR9wK7Pvn9o5b7ztKRvCds6', 'TELLER', 'ACTIVE');

-- Dữ liệu mẫu cho bảng Teller
INSERT INTO `teller` (`fullName`, `email`, `phone`, `userId`)
VALUES
  ('John Doe', 'jane.smith@example.com', '052-521-6319', 2),
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
  ('David Yellow', 'david.yellow@example.com', '077-889-9001', NULL, NULL, 10),
  ('Boon Real', 'boonreal@example.com','111-222-3333',NULL,NULL,11);

-- Dữ liệu mẫu cho bảng PaymentAccount (thêm dấu gạch ngang vào accountNumber)
INSERT INTO `paymentaccount` (`accountNumber`, `balance`, `customerId`)
VALUES
  ('123456789012', 10000.00, 1),
  ('987654321098', 5000.00, 4),
  ('112233445566', 3000.00, 5),
  ('998877665544', 1500.00, 6),
  ('667788990011', 7000.00, 7),
  ('889900112233', 2000.00, 8),
  ('998877665544', 4000.00, 9);

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
  (1200.00, 'Thanh toán nội bộ', '789012', '2024-12-12 19:00:00', 'HOÀN THÀNH', '1230001234', 'Bank A', '123456789012', 'Bank A', 220.00, 'SENDER');

-- Dữ liệu mẫu cho bảng Debits
INSERT INTO `debits` (`amount`, `content`, `status`, `cancelReason`, `paymentTransactionsId`, `creditor`, `debtor`)
VALUES
  (1000.00, 'Debit Transaction 1', 'Completed', NULL, 1, 1, 4),
  (500.00, 'Debit Transaction 2', 'Pending', NULL, 2, 4, 5);
  
-- Dữ liệu mẫu cho bảng Partners
INSERT INTO `partners` (`bankName`, `domain`, `partenerPublicKey`, `partenerAlgo`, `partenerSecretKey`, `ourPrivateKey`, `ourPublicKey`)
VALUES
('Bank2',
'localhost:80',
'-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZmjCPLjynjYv5OReKswNxdszz
vvdVnPwqp26U4Z3EpIgor/pi8tBdwpGnZmQ8dafanIsCwxA46Lva1LANLhmRnY7Q
b0qH79r8EPZnCzW2353j+G1uOJM47JVg3n3qrwNwQvlKjFxuHOr9h4wqkOxMQloz
D7eACpVqe7MGH5XYnwIDAQAB
-----END PUBLIC KEY-----', 'PGP', 'SecretKey'
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
  ('Bankit-pgp!',
'localhost:80',
'-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: Keybase OpenPGP v1.0.0
Comment: https://keybase.io/crypto
 
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
qIYxcXhYBQU=
=jinj
-----END PGP PUBLIC KEY BLOCK-----', 'PGP', 'SecretKey'
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

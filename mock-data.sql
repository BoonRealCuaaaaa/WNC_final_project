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
INSERT INTO `partners` (`bankName`, `domain`, `partenerPublicKey`, `ourPrivateKey`, `ourPublicKey`)
VALUES
  ('OWN_BANK', 'ownbank.com', 'public_key_ownbank', 'private_key_ownbank', 'public_key_ownbank'),
  ('BANK A', 'banka.com', 'public_key_banka', 'private_key_banka', 'public_key_banka'),
  ('BANK B', 'bankb.com', 'public_key_bankb', 'private_key_bankb', 'public_key_bankb');

-- Dữ liệu mẫu cho bảng Notification
INSERT INTO `notification` (`title`, `message`, `isRead`, `customerId`)
VALUES
  ('Thông báo 1', 'Thông báo quan trọng', FALSE, 1),
  ('Thông báo 2', 'Cập nhật dịch vụ', TRUE, 4),
  ('Thông báo 3', 'Bảo trì hệ thống', FALSE, 5),
  ('Thông báo 4', 'Khuyến mãi mới', TRUE, 6),
  ('Thông báo 5', 'Cập nhật hệ thống', FALSE, 7);

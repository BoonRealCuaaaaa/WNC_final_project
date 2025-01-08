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
('Bankit-pgp!',
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
'LS0tLS1CRUdJTiBQR1AgUFVCTElDIEtFWSBCTE9DSy0tLS0tClZlcnNpb246IEtleWJhc2UgT3BlblBHUCB2MS4wLjAKQ29tbWVudDogaHR0cHM6Ly9rZXliYXNlLmlvL2NyeXB0bwoKeHNCTkJHZGRkZXdCQ0FEWVZwQW0wdGNDRU9oSlp1ZStkMDE2VWpKYXQzVU4yNE5sLzlmY05qTkdHZUtXd2t6cwo4NTI3Vk9jVXd5OWN0ZVBsdUU0dXVMRmh4RFpkRkowU1pLSkl6d2pITjFhVlVYem12M0FKRisybWFIaVB3OVJmCkpSMzh6cExVMHd1WVI0UEk0SFJPeTdhM2FyVjRoNmNpR0xTM0prcEJtd3pFOC94UUZiY1FrTllETlhPcC9PZjYKQ0x1RWJTWGZvaHpsemZ6NGpsaHZlSzVLWTlJTXUrK0JxNFdQQUpJaDBrQUw3SjdFMzJJVjJzL0hLVEdDTTN4TwphU3NTM1FXS3I4cDRDaWpBSXRLbTdEaU1PSVNDM3FGdTkzeFp3T05YSm8wb1JjdjM1VTVoNU5RRkpTMlVldHhjCmNNSUtySy9zNlVORk5mdGI3OWN2UHlmNGJ4V1Jtc3Q5dnc2akFCRUJBQUhOSlZSeTRicW5iaUJOYVc1b0lFdG8KYjJFZ1BIUmxlakkzTWpVMFFIWnZaMk52TG1OdmJUN0N3RzBFRXdFS0FCY0ZBbWRkZGV3Q0d5OERDd2tIQXhVSwpDQUllQVFJWGdBQUtDUkE2SzFBS21BSEY0SGJ5Q0FEWFN3TVBVV3hxN1VBMFU2YVdxUHdyTjFtb1R4djBJR0JlCnBTZ0ZsZThUNmE0Rm0ybEJBSi9HWmM0S1pSL1RHczBnclZsRytXUytsZEV2eG9qcHY5eFFoTzUxLy9UTFlsQkUKQ1pxSFNvYityc0xyMlZiWkpydU9YSnhVMHRSUnU1Wm9CTk5Pb2NsWmFBSDlGejhLZkg4bGhjR0JJay93V1ZhRAoxT2JxVG50blhDK0dKeXZIY2h0T3RLRzZ5SUNCUjZuNnRiT28vMERIRXR2dVpDQUt5bFdENnpOUUJBZU91cy9oCmJxWlZPUXRqS2ZJN0dtdlMrc1RoS2ZZZXVxbGdZdEtOODlkVlVOd2hGdEt0OEJTeE53NzhHNGdLRGxvb0x5WHkKdGkyYjNObFdMTnZMcVYxeVRzVzJ2K1hsRXFFTmcvQzFjRjhQNGdXdGNSSlRLcFR6cVcxdnpzQk5CR2RkZGV3QgpDQURpTGtpR0kzUU9SdjVyOGJxN3JCUHFuWW5ZUGVKRWpuMXVPTFY4SkV2Z1FVRmhIQW1WOWViMC9QaDdZZnhSCjVJL0RWL1dBSXIwSGI1MVEvbzRwQjRpelRvV3J1MElQQVBRSHZEVzEra29KaytFcnFCbHlQMllrQ1VNMGtXYTQKckdoeEo1NWZpZmc3ZVFrT1UvZnhpbWxTTE5BNHI2UFZTRmZPSHhNeEtUOWwvVW5RMi9zSmxHRTd1dXNCaS90dAo5a0cxN3FZSG5OcUNLd0NIRm5lZm9oMVFpTjE1L1FVN0VXaFBpdXZHOEJXWU5WLzZONTZITW5qTUxNTnJneEh0CmxpV3RhbkZUQWhIUkdDSFhicExKY1hZKy92bng4MzhORVQ4NkV6dDFGZG5TVUhqOHRSWjQxN01hY1hidWlxbW4KK3p1M1JoMnBkdWNtY2JNZmhCSUR3eDAvQUJFQkFBSEN3WVFFR0FFS0FBOEZBbWRkZGV3RkNROEpuQUFDR3k0QgpLUWtRT2l0UUNwZ0J4ZURBWFNBRUdRRUtBQVlGQW1kZGRld0FDZ2tRQ0w5WmVpeWZlQWNha0FnQTFDZkwvTVZyCitHaWZnbFMzUkxMWGtHUlhTQ0ZRT0RHZlA5SWs3UkcxTGdHRW90TUZIUm0xWGppZEdIYmVaQUIxbXRJZUlmQ0gKbWYxS3hmNXRQS2plL1NSN0RXbVJpVUJaUW0rZm5ad1ZIeWMyeTRpZTlmbE9xQ1I1eEFQZDdMa3k0QXNHc05uawpuSlI4TzJkQXhPejM0SUNhOFIwTS9BejMzNHJwSG5Jb1hjdUgzdXZ4dHlBdnFyVDZxNGpvNFVFYUNISUhDT3liClZnYXVKZm0zZlhET01Dd1pKVVAxSEV1bVQ2QjkvZXZTR3N2bEhqK2NEZ1JRb1U1N25KR0p6bXU3L29CWFhOSXgKekRXV1cxZ1RlejdQUFpkelpyQTdTbnhYcUF1WHVNbysvbFgyc3VYaWZaYmtpS0tNRE9pcUY2ODNxZS9kYmxEcApNaFJ2RzN0cmNMem5HWVlQQi93TW5EcThreHhvWnpuUk5UN2hoZVowcW1aeUNlVFRKajJoNGNJVjRNakNNSXFFCnpJd1JoR1N1cmhpcHhSaGs2eHZTRmx6ajZBL29tVnI2L1JWeTJXeGZ1eHNQelEyWFh2dXdLdVdHazBzR0NqTDkKVSs5YXl1SGdBUjY4NWxJVU1nSVlNUVpORmZjMXQyQkVmU0FGTVNMcG5YaEJYbEFlaUxvRzRWUVFLSW51RklRSwpzM2tkaWp0KytwMktTLzlYZWN5Qm5wM3hCSXI2T3VBemVsQ1FMbkhGNmlXZ2ZHNndHVUFXalVnNG5abVJNc3UzCjVySDQ2TXVwUmhCeDZEem5mOTROQS8xVFVvQWNVWFFtc2Qvb1hVYjc1SkNTNTJsQTZscG9USmE0M2ZLYjNkUnUKcFFETWtKWTRtbGxPbXN2V1ZNUlZicUppMzQwaGgxbXMweWw4SkZhSXpzQk5CR2RkZGV3QkNBREY4cXBCUzV4RwpXUk85U0hUTmFvYXF3aTNPMmhUVTBPeGVRSHM5SmkzNm1hVDZWSUo4MVRGM3FoZU5nRDZkbnR6K2wvNURRZFhPCnd5SDJIQ1A2b09jZ2d5Y3V6WGhNVldOU2pibWUyc1cxZktZVEtENEFXNXNQWHFpSWg1cWpkdUhSZkllZS9PdEMKbk5mbWI1MVVXZDZZSzQ1TWJqS0pOQVo5OWMwMjdYQll1VEppNW5BTkx3V0lqVlo5Y1BZNFUzS21xUHYrUWMwdgpYSDE5d1N6UkdENFRFbWpPWjZGOU1qZml5NTJsVkdpOWY3c3FnemkrUHF3bVd4NVo2cUNqekJWaUdHZUNuMFBICklwSDN3L1RGMTM3THBWRXhRWW4rb3I5YjJMbC92YUI1cTdJUWVKd3haWGJ2OW1yRU5hZnVKMWhEUnZKdnJIencKeUthTitlbXNMcE9sQUJFQkFBSEN3WVFFR0FFS0FBOEZBbWRkZGV3RkNROEpuQUFDR3k0QktRa1FPaXRRQ3BnQgp4ZURBWFNBRUdRRUtBQVlGQW1kZGRld0FDZ2tRRjZRaDdKUTRtZjNmV0FmL1ZDdVFkUVBBZE1MaFM5NHpDd1g5CkxDYjV0TG5za3hZRlZ6UE9QVE4wbWk4SnBmNU1xeFBvSkRFa2lCcSsyUlEzL3h2WmJDYmFGTG1JNEx2QlNvNkcKb0NiODJ4bHRRK293cTRBR1JtNlMvRFZ3ME8xT0FzVEo0MjVBam1UbyszZzdMVVB1V3pJMndDU3MvUU9sWHpOegpmR3J3Z0tLOEJFZXU2OWRmNjdYWFJ4MktxVzZHZkRNaWlMc2JoTmxOeVFqbzFHdFVuTUxsS1YzZG92KzJVaHZ2CkdzS2xPWkNrb3VVNEJMTjJsbVRjalZNUmEwZTdSNTBTKzVPNENkdVA5UVpyQjRGL3JJdXMwTnUwSmdKY0JIR0YKNlFubWhvcS81eHMzeWZ2R0VERGVpNXZ4NlFSOUxJL0dqN2NUTU84cXhuZ1Q5TUkwMXBRNnl2Qm5iTTNuNG1vKwo0WUFUQi85eFl1YzA4VWhKbkpUSDJPTzRXRU5HZnBSWUYwRnliZEF1NXhBQi93dC80NGg5Y1VLMXJaOVdaTk85CkU0bU1vcHpQUFZsMVZkamR3d1diZ3ZxQzB5UzFVZW1IVWg2akZkMEF3S1h5V043dWdobzBPUzZvZ1FRMkVjT00KNmxtTU1Zb0NEU3lpS3UxRzlweW9mM2Y1WFY4L3pWZ0NsbTNoTWtkSlJhNzVFb3hRV1cvK2RUVC81clk5Ry9uRwpiZ1NTWHBIQjkxQ3ppbks2dngzWWdEWXhsZXNKNkJtcDROVXF1bHVtbU9qeUVpN3dFMlBoOGR5VC9odzRSU2NiCmRiQ2ZYZG9EcU04NmtodjhkU0lwWlhYbDloejIvQXdySEZBR0daTFlxNlgzQ1RseEZLUzVSUTZaWjBHUWpFQjYKRFViczU4ZTFxUXNML080ZkFNTVdUY05qanVGMQo9aEFaVAotLS0tLUVORCBQR1AgUFVCTElDIEtFWSBCTE9DSy0tLS0t', 'PGP', 'SecretKey',
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
-----END PUBLIC KEY-----'),
('Bankit-pgp!',
'localhost:80',
'LS0tLS1CRUdJTiBQR1AgUFVCTElDIEtFWSBCTE9DSy0tLS0tClZlcnNpb246IEtleWJhc2UgT3BlblBHUCB2MS4wLjAKQ29tbWVudDogaHR0cHM6Ly9rZXliYXNlLmlvL2NyeXB0bwoKeHNCTkJHZGRkZXdCQ0FEWVZwQW0wdGNDRU9oSlp1ZStkMDE2VWpKYXQzVU4yNE5sLzlmY05qTkdHZUtXd2t6cwo4NTI3Vk9jVXd5OWN0ZVBsdUU0dXVMRmh4RFpkRkowU1pLSkl6d2pITjFhVlVYem12M0FKRisybWFIaVB3OVJmCkpSMzh6cExVMHd1WVI0UEk0SFJPeTdhM2FyVjRoNmNpR0xTM0prcEJtd3pFOC94UUZiY1FrTllETlhPcC9PZjYKQ0x1RWJTWGZvaHpsemZ6NGpsaHZlSzVLWTlJTXUrK0JxNFdQQUpJaDBrQUw3SjdFMzJJVjJzL0hLVEdDTTN4TwphU3NTM1FXS3I4cDRDaWpBSXRLbTdEaU1PSVNDM3FGdTkzeFp3T05YSm8wb1JjdjM1VTVoNU5RRkpTMlVldHhjCmNNSUtySy9zNlVORk5mdGI3OWN2UHlmNGJ4V1Jtc3Q5dnc2akFCRUJBQUhOSlZSeTRicW5iaUJOYVc1b0lFdG8KYjJFZ1BIUmxlakkzTWpVMFFIWnZaMk52TG1OdmJUN0N3RzBFRXdFS0FCY0ZBbWRkZGV3Q0d5OERDd2tIQXhVSwpDQUllQVFJWGdBQUtDUkE2SzFBS21BSEY0SGJ5Q0FEWFN3TVBVV3hxN1VBMFU2YVdxUHdyTjFtb1R4djBJR0JlCnBTZ0ZsZThUNmE0Rm0ybEJBSi9HWmM0S1pSL1RHczBnclZsRytXUytsZEV2eG9qcHY5eFFoTzUxLy9UTFlsQkUKQ1pxSFNvYityc0xyMlZiWkpydU9YSnhVMHRSUnU1Wm9CTk5Pb2NsWmFBSDlGejhLZkg4bGhjR0JJay93V1ZhRAoxT2JxVG50blhDK0dKeXZIY2h0T3RLRzZ5SUNCUjZuNnRiT28vMERIRXR2dVpDQUt5bFdENnpOUUJBZU91cy9oCmJxWlZPUXRqS2ZJN0dtdlMrc1RoS2ZZZXVxbGdZdEtOODlkVlVOd2hGdEt0OEJTeE53NzhHNGdLRGxvb0x5WHkKdGkyYjNObFdMTnZMcVYxeVRzVzJ2K1hsRXFFTmcvQzFjRjhQNGdXdGNSSlRLcFR6cVcxdnpzQk5CR2RkZGV3QgpDQURpTGtpR0kzUU9SdjVyOGJxN3JCUHFuWW5ZUGVKRWpuMXVPTFY4SkV2Z1FVRmhIQW1WOWViMC9QaDdZZnhSCjVJL0RWL1dBSXIwSGI1MVEvbzRwQjRpelRvV3J1MElQQVBRSHZEVzEra29KaytFcnFCbHlQMllrQ1VNMGtXYTQKckdoeEo1NWZpZmc3ZVFrT1UvZnhpbWxTTE5BNHI2UFZTRmZPSHhNeEtUOWwvVW5RMi9zSmxHRTd1dXNCaS90dAo5a0cxN3FZSG5OcUNLd0NIRm5lZm9oMVFpTjE1L1FVN0VXaFBpdXZHOEJXWU5WLzZONTZITW5qTUxNTnJneEh0CmxpV3RhbkZUQWhIUkdDSFhicExKY1hZKy92bng4MzhORVQ4NkV6dDFGZG5TVUhqOHRSWjQxN01hY1hidWlxbW4KK3p1M1JoMnBkdWNtY2JNZmhCSUR3eDAvQUJFQkFBSEN3WVFFR0FFS0FBOEZBbWRkZGV3RkNROEpuQUFDR3k0QgpLUWtRT2l0UUNwZ0J4ZURBWFNBRUdRRUtBQVlGQW1kZGRld0FDZ2tRQ0w5WmVpeWZlQWNha0FnQTFDZkwvTVZyCitHaWZnbFMzUkxMWGtHUlhTQ0ZRT0RHZlA5SWs3UkcxTGdHRW90TUZIUm0xWGppZEdIYmVaQUIxbXRJZUlmQ0gKbWYxS3hmNXRQS2plL1NSN0RXbVJpVUJaUW0rZm5ad1ZIeWMyeTRpZTlmbE9xQ1I1eEFQZDdMa3k0QXNHc05uawpuSlI4TzJkQXhPejM0SUNhOFIwTS9BejMzNHJwSG5Jb1hjdUgzdXZ4dHlBdnFyVDZxNGpvNFVFYUNISUhDT3liClZnYXVKZm0zZlhET01Dd1pKVVAxSEV1bVQ2QjkvZXZTR3N2bEhqK2NEZ1JRb1U1N25KR0p6bXU3L29CWFhOSXgKekRXV1cxZ1RlejdQUFpkelpyQTdTbnhYcUF1WHVNbysvbFgyc3VYaWZaYmtpS0tNRE9pcUY2ODNxZS9kYmxEcApNaFJ2RzN0cmNMem5HWVlQQi93TW5EcThreHhvWnpuUk5UN2hoZVowcW1aeUNlVFRKajJoNGNJVjRNakNNSXFFCnpJd1JoR1N1cmhpcHhSaGs2eHZTRmx6ajZBL29tVnI2L1JWeTJXeGZ1eHNQelEyWFh2dXdLdVdHazBzR0NqTDkKVSs5YXl1SGdBUjY4NWxJVU1nSVlNUVpORmZjMXQyQkVmU0FGTVNMcG5YaEJYbEFlaUxvRzRWUVFLSW51RklRSwpzM2tkaWp0KytwMktTLzlYZWN5Qm5wM3hCSXI2T3VBemVsQ1FMbkhGNmlXZ2ZHNndHVUFXalVnNG5abVJNc3UzCjVySDQ2TXVwUmhCeDZEem5mOTROQS8xVFVvQWNVWFFtc2Qvb1hVYjc1SkNTNTJsQTZscG9USmE0M2ZLYjNkUnUKcFFETWtKWTRtbGxPbXN2V1ZNUlZicUppMzQwaGgxbXMweWw4SkZhSXpzQk5CR2RkZGV3QkNBREY4cXBCUzV4RwpXUk85U0hUTmFvYXF3aTNPMmhUVTBPeGVRSHM5SmkzNm1hVDZWSUo4MVRGM3FoZU5nRDZkbnR6K2wvNURRZFhPCnd5SDJIQ1A2b09jZ2d5Y3V6WGhNVldOU2pibWUyc1cxZktZVEtENEFXNXNQWHFpSWg1cWpkdUhSZkllZS9PdEMKbk5mbWI1MVVXZDZZSzQ1TWJqS0pOQVo5OWMwMjdYQll1VEppNW5BTkx3V0lqVlo5Y1BZNFUzS21xUHYrUWMwdgpYSDE5d1N6UkdENFRFbWpPWjZGOU1qZml5NTJsVkdpOWY3c3FnemkrUHF3bVd4NVo2cUNqekJWaUdHZUNuMFBICklwSDN3L1RGMTM3THBWRXhRWW4rb3I5YjJMbC92YUI1cTdJUWVKd3haWGJ2OW1yRU5hZnVKMWhEUnZKdnJIencKeUthTitlbXNMcE9sQUJFQkFBSEN3WVFFR0FFS0FBOEZBbWRkZGV3RkNROEpuQUFDR3k0QktRa1FPaXRRQ3BnQgp4ZURBWFNBRUdRRUtBQVlGQW1kZGRld0FDZ2tRRjZRaDdKUTRtZjNmV0FmL1ZDdVFkUVBBZE1MaFM5NHpDd1g5CkxDYjV0TG5za3hZRlZ6UE9QVE4wbWk4SnBmNU1xeFBvSkRFa2lCcSsyUlEzL3h2WmJDYmFGTG1JNEx2QlNvNkcKb0NiODJ4bHRRK293cTRBR1JtNlMvRFZ3ME8xT0FzVEo0MjVBam1UbyszZzdMVVB1V3pJMndDU3MvUU9sWHpOegpmR3J3Z0tLOEJFZXU2OWRmNjdYWFJ4MktxVzZHZkRNaWlMc2JoTmxOeVFqbzFHdFVuTUxsS1YzZG92KzJVaHZ2CkdzS2xPWkNrb3VVNEJMTjJsbVRjalZNUmEwZTdSNTBTKzVPNENkdVA5UVpyQjRGL3JJdXMwTnUwSmdKY0JIR0YKNlFubWhvcS81eHMzeWZ2R0VERGVpNXZ4NlFSOUxJL0dqN2NUTU84cXhuZ1Q5TUkwMXBRNnl2Qm5iTTNuNG1vKwo0WUFUQi85eFl1YzA4VWhKbkpUSDJPTzRXRU5HZnBSWUYwRnliZEF1NXhBQi93dC80NGg5Y1VLMXJaOVdaTk85CkU0bU1vcHpQUFZsMVZkamR3d1diZ3ZxQzB5UzFVZW1IVWg2akZkMEF3S1h5V043dWdobzBPUzZvZ1FRMkVjT00KNmxtTU1Zb0NEU3lpS3UxRzlweW9mM2Y1WFY4L3pWZ0NsbTNoTWtkSlJhNzVFb3hRV1cvK2RUVC81clk5Ry9uRwpiZ1NTWHBIQjkxQ3ppbks2dngzWWdEWXhsZXNKNkJtcDROVXF1bHVtbU9qeUVpN3dFMlBoOGR5VC9odzRSU2NiCmRiQ2ZYZG9EcU04NmtodjhkU0lwWlhYbDloejIvQXdySEZBR0daTFlxNlgzQ1RseEZLUzVSUTZaWjBHUWpFQjYKRFViczU4ZTFxUXNML080ZkFNTVdUY05qanVGMQo9aEFaVAotLS0tLUVORCBQR1AgUFVCTElDIEtFWSBCTE9DSy0tLS0t', 'PGP', 'SecretKey',
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

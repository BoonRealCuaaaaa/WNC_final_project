CREATE TABLE User (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255),
  password VARCHAR(255),
  role ENUM ('CUSTOMER', 'TELLER', 'ADMIN')
);

CREATE TABLE RefreshToken (
  id INT PRIMARY KEY AUTO_INCREMENT,
  refreshToken VARCHAR(255),
  userId INT,
  FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE TABLE Customer (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullName VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  otp VARCHAR(255),
  otpExpiredAt DATETIME,
  userId INT,
  FOREIGN KEY (userId) REFERENCES User(id)
);

CREATE TABLE PaymentAccount (
  id INT PRIMARY KEY AUTO_INCREMENT,
  accountNumber VARCHAR(255),
  balance DECIMAL(15, 2),
  customerId INT,
  FOREIGN KEY (customerId) REFERENCES Customer(id)
);

CREATE TABLE Beneficiaries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  shortName VARCHAR(100),
  bankName VARCHAR(255),
  accountNumber VARCHAR(255),
  customerId INT,
  FOREIGN KEY (customerId) REFERENCES Customer(id)
);

CREATE TABLE PaymentTransaction (
  id INT PRIMARY KEY AUTO_INCREMENT,
  amount DECIMAL(15, 2),
  content VARCHAR(255),
  otp VARCHAR(255),
  otpExpiredAt DATETIME,
  status VARCHAR(50),
  srcAccount VARCHAR(255),
  srcBankName VARCHAR(255),
  desAccount VARCHAR(255),
  bankName VARCHAR(255)
);

CREATE TABLE Debits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  amount DECIMAL(15, 2),
  content VARCHAR(255),
  status VARCHAR(50),
  paymentTransactionsId INT,
  creditor INT,
  debtor INT,
  FOREIGN KEY (paymentTransactionsId) REFERENCES PaymentTransaction(id),
  FOREIGN KEY (creditor) REFERENCES Customer(id),
  FOREIGN KEY (debtor) REFERENCES Customer(id)
);

CREATE TABLE Partners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bankName VARCHAR(255),
  domain VARCHAR(255),
  partenerPublicKey TEXT,
  ourPrivateKey TEXT,
  ourPublicKey TEXT
);



-- Dữ liệu mẫu cho bảng User
INSERT INTO `User` (`username`, `password`, `role`)
VALUES 
  ('john_doe', 'password123', 'CUSTOMER'),
  ('jane_smith', 'password123', 'TELLER'),
  ('admin_user', 'admin123', 'ADMIN'),
  ('mike_williams', 'password123', 'CUSTOMER'),
  ('emily_jones', 'password123', 'CUSTOMER'),
  ('lisa_white', 'password123', 'CUSTOMER'),
  ('tom_brown', 'password123', 'CUSTOMER'),
  ('lucy_black', 'password123', 'CUSTOMER'),
  ('susan_green', 'password123', 'CUSTOMER'),
  ('boon_real','password123','CUSTOMER'),
  ('david_yellow', 'password123', 'CUSTOMER');

-- Dữ liệu mẫu cho bảng Customer (otp và otpExpiredAt để trống)
INSERT INTO `Customer` (`fullName`, `email`, `phone`, `otp`, `otpExpiredAt`, `userId`)
VALUES
  ('John Doe', 'john.doe@example.com', '012-345-6789', NULL, NULL, 1),
  ('Jane Smith', 'jane.smith@example.com', '098-765-4321', NULL, NULL, 4),
  ('Mike Williams', 'mike.williams@example.com', '011-223-3445', NULL, NULL, 5),
  ('Emily Jones', 'emily.jones@example.com', '022-334-4556', NULL, NULL, 6),
  ('Lisa White', 'lisa.white@example.com', '033-445-5667', NULL, NULL, 7),
  ('Tom Brown', 'tom.brown@example.com', '044-556-6778', NULL, NULL, 8),
  ('Lucy Black', 'lucy.black@example.com', '055-667-7889', NULL, NULL, 9),
  ('Susan Green', 'susan.green@example.com', '066-778-8990', NULL, NULL, 10),
  ('David Yellow', 'david.yellow@example.com', '077-889-9001', NULL, NULL, 11);

-- Dữ liệu mẫu cho bảng PaymentAccount (thêm dấu gạch ngang vào accountNumber)
INSERT INTO `PaymentAccount` (`accountNumber`, `balance`, `customerId`)
VALUES
  ('123-456-789-012', 10000.00, 1),
  ('987-654-321-098', 5000.00, 4),
  ('112-233-445-566', 3000.00, 5),
  ('998-877-665-544', 1500.00, 6),
  ('667-788-990-011', 7000.00, 7),
  ('889-900-112-233', 2000.00, 8),
  ('998-877-665-544', 4000.00, 9);

-- Dữ liệu mẫu cho bảng Beneficiaries (chỉ có bankName là 'OWN_BANK' hoặc 'BANK A')
INSERT INTO `Beneficiaries` (`name`, `shortName`, `bankName`, `accountNumber`, `customerId`)
VALUES
  ('Alice Johnson', 'Alice', 'BANK A', '123-000-1234', 1),
  ('Bob Brown', 'Bob', 'OWN_BANK', '987-000-9876', 4),
  ('Charlie White', 'Charlie', 'BANK A', '333-000-3333', 5),
  ('David Green', 'David', 'OWN_BANK', '444-000-4444', 6),
  ('Eve Blue', 'Eve', 'BANK A', '555-000-5555', 7),
  ('Frank Grey', 'Frank', 'OWN_BANK', '666-000-6666', 8),
  ('Grace Yellow', 'Grace', 'BANK A', '777-000-7777', 9);

-- Dữ liệu mẫu cho bảng PaymentTransaction (status dùng tiếng Việt)
INSERT INTO `PaymentTransaction` (`amount`, `content`, `otp`, `otpExpiredAt`, `status`, `srcAccount`, `srcBankName`, `desAccount`, `bankName`)
VALUES
  (1000.00, 'Thanh toán dịch vụ', '123456', '2024-12-12 12:00:00', 'ĐANG XỬ LÝ', '123-456-789-012', 'Bank A', '987-000-9876', 'Bank B'),
  (500.00, 'Thanh toán hàng hóa', '654321', '2024-12-12 13:00:00', 'HOÀN THÀNH', '987-654-321-098', 'Bank B', '123-000-1234', 'Bank A'),
  (1500.00, 'Thanh toán hóa đơn', '234567', '2024-12-12 14:00:00', 'ĐANG XỬ LÝ', '112-233-445-566', 'Bank C', '333-000-3333', 'Bank C'),
  (2000.00, 'Thanh toán cho đối tác', '345678', '2024-12-12 15:00:00', 'HOÀN THÀNH', '667-788-990-011', 'Bank D', '444-000-4444', 'Bank D'),
  (2500.00, 'Thanh toán dịch vụ công', '456789', '2024-12-12 16:00:00', 'ĐANG XỬ LÝ', '889-900-112-233', 'Bank E', '555-000-5555', 'Bank E'),
  (1000.00, 'Thanh toán tiền mặt', '567890', '2024-12-12 17:00:00', 'HOÀN THÀNH', '998-877-665-544', 'Bank F', '666-000-6666', 'Bank F'),
  (3000.00, 'Thanh toán khoản vay', '678901', '2024-12-12 18:00:00', 'ĐANG XỬ LÝ', '998-877-665-544', 'Bank G', '777-000-7777', 'Bank G'),
  (4000.00, 'Thanh toán dịch vụ trực tuyến', '789012', '2024-12-12 19:00:00', 'HOÀN THÀNH', '223-344-556-677', 'Bank H', '888-000-8888', 'Bank H'),
  (3500.00, 'Thanh toán phí dịch vụ', '890123', '2024-12-12 20:00:00', 'ĐANG XỬ LÝ', '334-455-667-788', 'Bank I', '999-000-9999', 'Bank I');

-- Dữ liệu mẫu cho bảng Debits (status dùng tiếng Việt)
INSERT INTO `Debits` (`amount`, `content`, `status`, `paymentTransactionsId`, `creditor`, `debtor`)
VALUES
  (1000.00, 'Thanh toán dịch vụ', 'Chưa thanh toán', NULL, 1, 4),
  (500.00, 'Thanh toán hàng hóa', 'Đã thanh toán', 2, 4, 1),
  (1500.00, 'Thanh toán hóa đơn', 'Đã hủy', NULL, 5, 6),
  (2000.00, 'Thanh toán cho đối tác', 'Chưa thanh toán', NULL, 7, 8),
  (2500.00, 'Thanh toán dịch vụ công', 'Chưa thanh toán', NULL, 9, 7),
  (1000.00, 'Thanh toán tiền mặt', 'Chưa thanh toán', NULL, 5, 1),
  (3000.00, 'Thanh toán khoản vay', 'Đã thanh toán', 7, 6, 2),
  (4000.00, 'Thanh toán dịch vụ trực tuyến', 'Đã thanh toán', 8, 8, 3),
  (3500.00, 'Thanh toán phí dịch vụ', 'Đã hủy', NULL, 3, 7);

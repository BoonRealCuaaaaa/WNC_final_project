import express from "express";
import {
  getNotifications,
  readNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();
/**
 * @swagger
 * /notification:
 *   get:
 *     summary: Lấy danh sách thông báo của người dùng
 *     description: API để lấy tất cả các thông báo của người dùng hiện tại dựa trên ID người dùng.
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách các thông báo.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID của thông báo.
 *                     example: 1
 *                   title:
 *                     type: string
 *                     description: Tiêu đề của thông báo.
 *                     example: "Thanh toán nợ thành công"
 *                   message:
 *                     type: string
 *                     description: Nội dung của thông báo.
 *                     example: "Bạn đã thanh toán nợ cho người nhận thành công."
 *                   customerId:
 *                     type: integer
 *                     description: ID của khách hàng nhận thông báo.
 *                     example: 123
 *                   isRead:
 *                     type: boolean
 *                     description: Trạng thái đã đọc của thông báo.
 *                     example: false
 *                   relatedDebitUrl:
 *                     type: string
 *                     description: Liên kết đến giao dịch liên quan
 *                   customer:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID của khách hàng.
 *                         example: 1
 *                       fullName:
 *                         type: string
 *                         description: Tên đầy đủ của khách hàng.
 *                         example: "Nguyễn Văn A"
 *                       email:
 *                         type: string
 *                         description: Địa chỉ email của khách hàng.
 *                         example: "nguyenvana@example.com"
 *                       phone:
 *                         type: string
 *                         description: Số điện thoại của khách hàng.
 *                         example: "0123456789"
 *       401:
 *         description: Người dùng không được phép truy cập (chưa xác thực).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Lỗi hệ thống khi lấy thông báo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi hệ thống"
 *     security:
 *       - jwt: []
 *     tags:
 *       - Notification
 */

/**
 * @swagger
 * /notification/read:
 *   post:
 *     summary: Đánh dấu thông báo là đã đọc
 *     description: API để đánh dấu một thông báo là đã đọc bằng cách cập nhật trường `isRead` của thông báo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationId:
 *                 type: integer
 *                 description: ID của thông báo cần đánh dấu là đã đọc.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Thành công, trả về thông báo đã được cập nhật với trạng thái đã đọc.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification marked as read"
 *       400:
 *         description: Yêu cầu không hợp lệ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad Request"
 *       401:
 *         description: Người dùng không được phép truy cập (chưa xác thực).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: Không tìm thấy thông báo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification not found"
 *       500:
 *         description: Lỗi hệ thống khi cập nhật thông báo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi hệ thống"
 *     security:
 *       - jwt: []
 *     tags:
 *       - Notification
 */
router.get("/", getNotifications);

router.post("/read", readNotification);

export default router;

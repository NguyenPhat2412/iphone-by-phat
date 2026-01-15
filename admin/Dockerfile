# Bước 1: Build mã nguồn React (Stage 1)
FROM node:20-alpine as build-stage
WORKDIR /app
COPY package*.json ./
# Cài đặt toàn bộ dependencies bao gồm cả Vite
RUN npm install
COPY . .
# SỬA Ở ĐÂY: Dùng 'run build' để tạo thư mục dist thay vì 'start'
RUN npm run build 

# Bước 2: Chạy bằng Nginx (Stage 2)
FROM nginx:stable-alpine
# Copy kết quả đã build từ stage trước vào thư mục của Nginx
# Lưu ý: Kiểm tra xem thư mục build của bạn là 'dist' hay 'build'
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# GlobalShop - Cross-Border E-commerce Platform

一个功能完整的跨境电商平台，支持多种货币和多语言。

## 功能特性

- 🌍 **全球化支持**
  - 多货币转换 (USD, EUR, GBP, JPY, CNY, INR等)
  - 多语言支持 (英文、西班牙文、法文、中文、日文)
  
- 🛒 **购物功能**
  - 产品浏览和搜索
  - 分类过滤和价格范围过滤
  - 购物车管理
  - 订单管理

- 👤 **用户系统**
  - 用户注册和登录
  - 个人资料管理
  - 订单历史记录
  - 用户偏好设置

- 📦 **商家功能**
  - 产品管理
  - 库存管理
  - 销售数据跟踪

- 💳 **支付系统**
  - Stripe 集成
  - 多种支付方式（信用卡、PayPal、银行转账）

- ⭐ **产品评价**
  - 用户评价和评分
  - 评价管理

## 技术栈

### 后端
- **Node.js + Express.js** - 服务器框架
- **MongoDB** - 数据库
- **JWT** - 用户认证
- **Stripe** - 支付处理
- **Bcryptjs** - 密码加密

### 前端
- **React** - UI 框架
- **React Router** - 路由管理
- **Axios** - HTTP 请求
- **React Toastify** - 通知系统

## 项目结构

```
.
├── server/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── utils/
│   │   └── currencyConverter.js
│   └── index.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── ProductCard.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── ProductsPage.js
│   │   │   ├── ProductDetailPage.js
│   │   │   ├── CartPage.js
│   │   │   ├── CheckoutPage.js
│   │   │   ├── OrdersPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   └── ProfilePage.js
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── App.css
│   │   │   ├── Navbar.css
│   │   │   ├── Footer.css
│   │   │   └── ...
│   │   └── App.js
│   └── package.json
├── package.json
├── .env.example
└── README.md
```

## 安装和运行

### 前置要求
- Node.js 14+ 
- MongoDB 4.4+
- npm 或 yarn

### 安装

1. **克隆仓库**
```bash
git clone <repository-url>
cd cross-border-ecommerce
```

2. **安装后端依赖**
```bash
npm install
```

3. **安装前端依赖**
```bash
cd client
npm install
cd ..
```

### 配置环境变量

创建 `.env` 文件（复制 `.env.example`）：

```bash
cp .env.example .env
```

编辑 `.env` 并设置以下变量：
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce

JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_public

EXCHANGE_RATE_API=https://api.exchangerate-api.com/v4/latest/

CORS_ORIGIN=http://localhost:3000
```

### 启动开发服务

#### 启动后端服务器
```bash
npm run dev
```
服务器将在 `http://localhost:5000` 运行

#### 启动前端开发服务器
```bash
npm run client
```
应用将在 `http://localhost:3000` 运行

## API 端点

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `PUT /api/auth/profile` - 更新用户资料

### 产品
- `GET /api/products` - 获取产品列表
- `GET /api/products/:id` - 获取产品详情
- `POST /api/products` - 创建产品（卖家）
- `PUT /api/products/:id` - 更新产品（卖家）
- `DELETE /api/products/:id` - 删除产品（卖家）
- `POST /api/products/:id/reviews` - 添加评价

### 购物车
- `GET /api/cart` - 获取购物车
- `POST /api/cart/add` - 添加项目到购物车
- `PUT /api/cart/update/:itemId` - 更新购物车项目
- `DELETE /api/cart/remove/:itemId` - 移除购物车项目
- `DELETE /api/cart/clear` - 清空购物车

### 订单
- `POST /api/orders/create` - 创建订单
- `GET /api/orders` - 获取用户订单
- `GET /api/orders/:id` - 获取订单详情
- `POST /api/orders/:id/payment` - 处理支付
- `PUT /api/orders/:id/status` - 更新订单状态
- `POST /api/orders/:id/cancel` - 取消订单

## 用户角色

- **Customer** - 普通消费者
- **Seller** - 商家
- **Admin** - 管理员

## 支持的货币

- USD - 美元
- EUR - 欧元
- GBP - 英镑
- JPY - 日元
- CNY - 人民币
- INR - 印度卢比

## 支持的语言

- 英文 (en)
- 西班牙文 (es)
- 法文 (fr)
- 中文 (zh)
- 日文 (ja)

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系：support@globalshop.com

## 部署

### 使用 Docker

```bash
docker-compose up -d
```

### 使用 Heroku

1. 创建 Heroku 账户
2. 安装 Heroku CLI
3. 运行部署命令

```bash
heroku login
heroku create your-app-name
git push heroku main
```

## 贡献

欢迎提交 Pull Request！

---

**祝你使用愉快！** 🎉

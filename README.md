# **Task Manager API Documentation**

A RESTful API for managing tasks, with a Next.js frontend hosted on Vercel.

----------

# **👅 Installation & Setup** 


### **Prerequisites**

-   Node.js (v18+)
    
-   MongoDB Atlas (for Data Persistence)
    
-   Git
    
### **Backend Setup**

1.  **Clone the repository**:
    
    ```bash
    git clone https://github.com/Darkboy17/task-manager.git
    cd task-manager/backend
    ```
    
2.  **Install dependencies**:
    
    ```bash
    npm install
    ```
    
3.  **Configure environment variables**:  
    Create a `.env` file:
    
    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xop3g.mongodb.net/algoroot-task-manager?retryWrites=true&w=majority
	PORT=5000
    ```
	   *Note:  Sign-up for a MongoDB Atlas account. Create a cluster and get the connection string from there and paste it as a value for `MONGODB_URI`in the .env file.*
4.  **Run the server**:
    
    ```bash
    npm run dev  # Development
    ```
----------

### **Frontend Setup**

1. **Navigate to frontend directory:**
    
    ```bash
    cd ../frontend
    ```

2. **Install dependencies:**
    
    ```bash
    npm install
    ```

3. **Configure environment:**  
    Create `.env` file:
    
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```

4. **Run frontend:**
    
    ```bash
    npm run dev
    ```
    
    Access at: [http://localhost:3000](http://localhost:3000)

----------

## **🌐 API Endpoints**

### **Tasks**

| Method | Endpoint | Description | Request Body (JSON) | Response (JSON) |
|--------|---------|-------------|---------------------|-----------------|
| `GET`  | `/api/tasks` | Get all tasks | not required | `[{ _id: 1, title: "sample task", description: "", createdAt: "", updatedAt: "", titleHash: "" ... }]` |
| `POST` | `/api/tasks` | Create a task | `{ title: "New Task", description: "New description", completed: false }` | `{ success: "True", data: { _id: 1, title: "New Task", description: "New description", createdAt: "", updatedAt: "", titleHash: "" ... } ... }` |
| `PUT`  | `/api/tasks/:id` | Update a task | `{ title: "Updated Task", completed: true }` | `{ success: "True", data: { _id: 1, title: "Updated Task", completed: True, createdAt: 2025... } ... }` |
| `DELETE` | `/api/tasks/:id` | Delete a task | not required | `{ message: "Task deleted" }` |

----------

## **🔧 Testing API with PowerShell on Windows 10/11**

Use `Invoke-RestMethod` to test endpoints:

*Note: Run the RESTFul API (backend) before testing and open Powershell.*

### **1. Fetch All Tasks**

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method Get
$response | ConvertTo-Json -Depth 10
```

### **2. Create a Task**

```powershell
$body = @{ title = "PowerShell Task"; completed = $false } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method Post -Body $body -ContentType "application/json"
```

### **3. Update a Task**

```powershell
$body = @{ title = "Updated via PowerShell"; completed = $true } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/tasks/1" -Method Put -Body $body -ContentType "application/json"
```

### 4. Delete a Task

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/tasks/1" -Method Delete -ContentType "application/json"
```
----------

## **🏠 UI Screenshots**

### **1. Task Dashboard**

![Home](https://github.com/user-attachments/assets/84711be3-6c87-4f8b-80c0-4de8cfd6b1be)


### **2. Add New Task Modal**

![Create Task](https://github.com/user-attachments/assets/a01af83f-ec9c-41f9-b97a-df15df22c265)


### **3. Edit Task Modal**

![Create Task](https://github.com/user-attachments/assets/6fa5ff10-eeaf-48f1-b2e0-a9b3e93c275e)


----------

**📌 Note**:

-   For local testing, ensure the backend server is running (`npm run dev`).
    
-   Use `curl` or Postman as alternatives to PowerShell.


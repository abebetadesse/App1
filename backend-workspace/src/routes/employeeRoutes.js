import express from 'express';
const router = express.Router();

// Mock employee database
let employees = [
  { id: 1, name: 'John Doe', email: 'john@tham.com', department: 'IT', position: 'Developer' },
  { id: 2, name: 'Jane Smith', email: 'jane@tham.com', department: 'HR', position: 'Manager' },
  { id: 3, name: 'Bob Johnson', email: 'bob@tham.com', department: 'Sales', position: 'Executive' },
];

// GET /api/employee
router.get('/', (req, res) => {
  const { department, search } = req.query;
  
  let filteredEmployees = [...employees];
  
  if (department) {
    filteredEmployees = filteredEmployees.filter(e => e.department === department);
  }
  
  if (search) {
    filteredEmployees = filteredEmployees.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    message: 'Employees retrieved',
    data: {
      employees: filteredEmployees,
      departments: [...new Set(employees.map(e => e.department))],
      total: filteredEmployees.length,
    },
  });
});

// GET /api/employee/:id
router.get('/:id', (req, res) => {
  const employee = employees.find(e => e.id === parseInt(req.params.id));
  
  if (employee) {
    res.json({
      success: true,
      message: 'Employee details',
      data: {
        ...employee,
        details: {
          hireDate: '2023-01-15',
          salary: 75000,
          status: 'active',
          performance: 'excellent',
        },
      },
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }
});

// POST /api/employee
router.post('/', (req, res) => {
  const { name, email, department, position } = req.body;
  
  if (!name || !email || !department || !position) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }
  
  const newEmployee = {
    id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
    name,
    email,
    department,
    position,
    createdAt: new Date().toISOString(),
  };
  
  employees.push(newEmployee);
  
  res.status(201).json({
    success: true,
    message: 'Employee created successfully',
    data: newEmployee,
  });
});

// PUT /api/employee/:id
router.put('/:id', (req, res) => {
  const employeeIndex = employees.findIndex(e => e.id === parseInt(req.params.id));
  
  if (employeeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }
  
  employees[employeeIndex] = {
    ...employees[employeeIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  
  res.json({
    success: true,
    message: 'Employee updated successfully',
    data: employees[employeeIndex],
  });
});

// DELETE /api/employee/:id
router.delete('/:id', (req, res) => {
  const employeeIndex = employees.findIndex(e => e.id === parseInt(req.params.id));
  
  if (employeeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }
  
  const deletedEmployee = employees.splice(employeeIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Employee deleted successfully',
    data: deletedEmployee,
  });
});

// GET /api/employee/:id/performance
router.get('/:id/performance', (req, res) => {
  const employee = employees.find(e => e.id === parseInt(req.params.id));
  
  if (employee) {
    res.json({
      success: true,
      message: 'Employee performance',
      data: {
        employeeId: employee.id,
        name: employee.name,
        metrics: {
          productivity: 85,
          quality: 90,
          attendance: 95,
          teamwork: 88,
          overall: 89.5,
        },
        reviews: [
          { date: '2024-01-01', rating: 4.5, reviewer: 'Manager A' },
          { date: '2023-12-01', rating: 4.0, reviewer: 'Manager B' },
        ],
      },
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Employee not found',
    });
  }
});

// POST /api/employee/:id/attendance
router.post('/:id/attendance', (req, res) => {
  const { date = new Date().toISOString().split('T')[0], status = 'present' } = req.body;
  
  res.json({
    success: true,
    message: 'Attendance recorded',
    data: {
      employeeId: req.params.id,
      date,
      status,
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
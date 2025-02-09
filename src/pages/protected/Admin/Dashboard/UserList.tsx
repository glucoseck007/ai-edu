import type React from "react"
import { useState } from "react"
import { Table, Pagination } from "react-bootstrap"

interface User {
    id: number
    name: string
    email: string
    role: string
}

const UserList: React.FC = () => {
    const [users] = useState<User[]>([
        { id: 1, name: "John Doe", email: "john@example.com", role: "Student" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Teacher" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Student" },
        { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Student" },
        { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "Teacher" },
        // Add more users as needed
    ])

    const [currentPage, setCurrentPage] = useState(1)
    const usersPerPage = 5

    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)

    const totalPages = Math.ceil(users.length / usersPerPage)

    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber)

    return (
        <div>
            <h2>User List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </div>
    )
}

export default UserList
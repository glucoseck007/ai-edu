import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TestList: React.FC = () => {
    const [tests] = useState([
        { id: 1, title: "Test 1" },
        { id: 2, title: "Test 2" },
        { id: 3, title: "Test 3" }
    ]);
    const navigate = useNavigate();

    return (
        <div className="container my-4">
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {tests.map(test => (
                    <div className="col" key={test.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{test.title}</h5>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/test/${test.id}`)}
                                >
                                    Take Test
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestList;
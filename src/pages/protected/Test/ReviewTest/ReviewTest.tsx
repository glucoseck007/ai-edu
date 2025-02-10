const ReviewTest: React.FC = ()=>{

    const storedData = JSON.parse(localStorage.getItem("quiz") || "{}");

    const quizData = Array.isArray(storedData.quiz) ? storedData.quiz : [];
    console.log(quizData);

    return(
        <>
            {quizData.map((quiz: any, index: number) => (
                <ul key={index}>
                    <li><strong>Question:</strong> {quiz.Question}</li>
                    <li><strong>Your Answer:</strong> {quiz.Answers.join(", ")}</li>
                    <li><strong>Correct Answer:</strong> {quiz["Correct Answer"]}</li>
                    <li><strong>Reference:</strong> {quiz.Reference}</li>
                    <li><strong>Type:</strong> {quiz["Question Type"]}</li>
                </ul>
            ))}
            //thêm button sửa câu hỏi
        </>
    );
}

export default ReviewTest;
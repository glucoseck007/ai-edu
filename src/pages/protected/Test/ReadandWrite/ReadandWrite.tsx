import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Modal, Overlay, Popover } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid, faCalculator, faChevronRight, faCircleExclamation, faClock, faFileHalfDashed, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { numberToLetter } from '../../../../utils/Converters';
// import './Test.css';

const ReadingWritingModule: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<{ [key: number]: boolean }>({});

  const [isConfused, setIsConfused] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedConfused, setSelectedConfused] = useState<number[]>([]);
  const [showDirections, setShowDirections] = useState(false);
  const [show, setShow] = useState<boolean>(false);
  const target = useRef(null);
 const data = {
    "quiz": [
    {
      "Question": "Ai đã chỉ huy cuộc tấn công vào năm 1282 chống lại Đế quốc Chiêm?",
      "Answers": [
        "Hốt Tất Liệt",
        "Toa Đô",
        "Trần Nhân Tông"
      ],
      "Correct Answer": "Toa Đô",
      "Reference": "Năm 1282, nhà Nguyên sai Toa Đô mang quân vượt biển đánh Chiêm Thành ở phía nam Đại Việt.",
      "Question Type": "MCQ"
    },
    {
      "Question": "Là đúng hay sai rằng Hốt Tất Liệt trực tiếp chỉ huy cuộc tấn công vào năm 1282 chống lại Đế quốc Chiêm?",
      "Answers": [
        "Đúng",
        "Sai"
      ],
      "Correct Answer": "Sai",
      "Reference": "Năm 1282, nhà Nguyên sai Toa Đô mang quân vượt biển đánh Chiêm Thành ở phía nam Đại Việt.",
      "Question Type": "TF"
    },
    {
      "Question": "Trần Hưng Đạo được thăng quan gì để chuẩn bị kháng chiến lần hai?",
      "Answers": [
        "Tướng quân",
        "Binh bộ thượng thư",
        "Thượng tướng"
      ],
      "Correct Answer": "Tướng quân",
      "Reference": "Tháng Mười (âm lịch) năm 1283, Trần Hưng Đạo được phong làm Quốc công tiết chế thống lĩnh chư quân.",
      "Question Type": "MCQ"
    },
    {
      "Question": "Trần Hưng Đạo đã chia các đơn vị quân đội như thế nào?",
      "Answers": [
        "Chia theo cấp độ",
        "Phân cho các quân hiệu tài giỏi",
        "Kết hợp cả hai"
      ],
      "Correct Answer": "Phân cho các quân hiệu tài giỏi",
      "Reference": "Ông chọn các quân hiệu tài giỏi, cho chia nhau chỉ huy các đơn vị quân đội.",
      "Question Type": "MCQ"
    },
    {
      "Question": "Ai đã cho duyệt quân ở bến Đông Bộ Đầu?",
      "Answers": [
        "Trần Hưng Đạo",
        "Hồ Quý Ly",
        "Lê Lợi"
      ],
      "Correct Answer": "Trần Hưng Đạo",
      "Reference": "Tháng Tám (âm lịch) năm sau (1284), ông cho duyệt quân ở bến Đông Bộ Đầu.",
      "Question Type": "MCQ"
    }
    ]
  }
useEffect(()=>{
  data.quiz.map((value,index)=>{
    return console.log(value);
    
  })  
},[])
  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => window.clearInterval(interval);

  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleBookmark = (questionIndex: number) => {
    console.log(bookmarkedQuestions);
    setBookmarkedQuestions(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex], // Đảo trạng thái của câu hỏi đang bấm
    }));
  };
  

  const toggleConfusion = () => {
    setIsConfused(!isConfused);
  }

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
  };

  const toggleConfusedOption = (index: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedConfused((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleDirectionsClose = () => setShowDirections(false);

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Header */}
      <Container className="px-0">
        <header className="bg-white p-3 d-flex justify-content-between align-items-center border border-top-0 border-secondary-subtle rounded-bottom-4 border-3">
          <div>
           
          
          </div>
          <div
            className="d-flex flex-column align-items-center"
            style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
          >
            {isRunning ? (
              <span className="fw-medium" style={{ fontSize: '1.2rem' }}>{formatTime(time)}</span>
            ) : (
              <span className="fw-medium" style={{ fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faClock} />
              </span>
            )}

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
              className="rounded-pill px-3"
              style={{ fontSize: '0.875rem', minWidth: '60px' }}
            >
              {isRunning ? 'hide' : 'show'}
            </Button>
          </div>
          <Button variant="outline-dark" className="rounded-pill px-4">Save & Exit</Button>
        </header>
      </Container>

      {/* Main Content */}
      <Container className="flex-grow-1">
        {data.quiz.map((value,index)=>{
          
          return (
            <Row className="py-4" key={index}>
            <Col md={6} className="border-end">
              <p className='text-dark'>
               {value.Question}
              </p>
            </Col>
            <Col md={6} className='px-4 d-flex flex-column'>
              {/* Question Header */}
              <div className="d-flex justify-content-between align-items-center mb-3 bg-secondary-subtle rounded-pill px-3 py-2">
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-dark text-white"
                    style={{ width: '28px', height: '28px', fontSize: '14px' }}>
                    {index+1}
                  </div>
                  <Button
                    variant="link"
                    className="text-dark text-decoration-none d-flex align-items-center gap-2 p-0"
                    onClick={()=>toggleBookmark(index)}
                  >
                    <FontAwesomeIcon icon={bookmarkedQuestions[index] ? faBookmarkSolid : faBookmarkRegular}/>
                    <span>Mark for Review</span>
                  </Button>
                </div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-pill px-3 position-relative custom-slash"
                  onClick={toggleConfusion}
                >
                  <span className="text-dark fw-bold">ABC</span>
                </Button>
              </div>
  
              {/* Main Question Content */}
              <div className="flex-grow-1">
                <p className='text-dark'>Which choice completes the text with the most logical and precise word or phrase?</p>
                <div className="mb-3 px-2">
                  {value.Answers.map((option, index) => (
                    <div
                     style={{ cursor: 'pointer' }}
                      key={index}
                      className={`d-flex align-items-center gap-3 mb-3 hover-effect`}
                      onClick={() => handleOptionClick(index)}>
                      <div className={`flex-grow-1 d-flex justify-content-between align-items-center border border-3 ${selectedConfused.includes(index)
                        ? 'border-secondary slashed'
                        : selectedOption === index
                          ? 'border-primary'
                          : 'border-black'
                        } rounded-pill px-3 py-2`}>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-dark"
                            style={{ width: '28px', height: '28px', fontSize: '14px' }}
                          >
                            {numberToLetter(index + 1)}
                          </div>
                          <span className={selectedOption === index && selectedConfused.includes(index) ? 'text-secondary' : ''}>
                            {option}
                          </span>
                        </div>
                      </div>
                      {isConfused && (
                        selectedConfused.includes(index) ? (
                          <div
                            style={{ fontSize: '12px', cursor: 'pointer' }}
                            onClick={toggleConfusedOption(index)}
                          >
                            <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Undo</span>
                          </div>
                        ) : (
                          <div
                            className={`d-flex align-items-center justify-content-center rounded-circle bg-white text-dark border border-2 border-black position-relative ${isConfused ? 'slashed' : ''}`}
                            style={{ width: '30px', height: '30px', fontSize: '14px' }}
                            onClick={toggleConfusedOption(index)}
                          >
                            {numberToLetter(index + 1)}
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Report Error Button */}
              <div className="d-flex justify-content-end mt-auto pt-3">
                <Button
                  variant="link"
                  className="text-secondary text-decoration-none d-flex align-items-center gap-2 p-0"
                >
                  <FontAwesomeIcon icon={faCircleExclamation} />
                  <span>Report Error</span>
                </Button>
              </div>
            </Col>
          </Row>
          )
        })}
       
      </Container >

      {/* Footer */}
      < div className="bg-light mt-auto" >
        <Container>
          <div className="p-3 d-flex justify-content-between align-items-center">
            <span>DSAT Practice Test 1</span>
            <div className="d-flex align-items-center gap-2">
            

              <Overlay
                target={target.current}
                show={show}
                placement="top"
                rootClose
                onHide={() => setShow(false)}
                containerPadding={20}
              >
                <Popover
                  id="question-popover"
                  className="question-navigator-popover"
                  style={{ maxWidth: '500px' }}
                >
                  <div style={{ width: '490px' }}>
                    <Popover.Header as="h3" className="bg-light border-bottom d-flex justify-content-between align-items-center">
                      <span>Reading and Writing: Module 1</span>
                      <button className="btn-close" onClick={() => setShow(false)} />
                    </Popover.Header>
                    <Popover.Body className="p-3">
                      <div className="d-flex justify-content-center gap-3 mb-3 border-bottom pb-2">
                        <div className="d-flex align-items-center gap-2">
                          <FontAwesomeIcon icon={faLocationDot} />
                          Current
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <FontAwesomeIcon icon={faFileHalfDashed} />
                          Unanswered
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <FontAwesomeIcon icon={faBookmarkSolid} />
                          For Review
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {[...Array(27)].map((_, i) => {
                          const num = i + 1;
                          const isCurrent = num === 1;

                          return (
                            <Button
                              key={num}
                              variant={isCurrent ? 'primary' : 'outline-secondary'}
                              size="sm"
                              className={`rounded-1 p-1 ${!isCurrent && 'border-dashed'}`}
                              style={{ minWidth: '32px' }}
                            >
                              {num}
                            </Button>
                          );
                        })}
                      </div>

                      <div className="text-center">
                        <Button variant="outline-primary" className="rounded-pill px-4">
                          Go to Review Page
                        </Button>
                      </div>
                    </Popover.Body>
                  </div>
                </Popover>
              </Overlay>
            </div>
        
          </div>
        </Container>
      </div >
      <Modal
        show={showDirections}
        onHide={handleDirectionsClose}
        dialogClassName="modal-100w"
        aria-labelledby="example-custom-modal-styling-title"
      // centered
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <p>Each passage below is accompanied by a number of questions. For some questions, you will consider how the passage might be revised to improve the expression of ideas. For other questions, you will consider how the passage might be edited to correct errors in sentence structure, usage, or punctuation. A passage or a question may be accompanied by one or more graphics (such as a table or graph) that you will need to consider as you make revising and editing decisions.</p>
        </Modal.Body>
      </Modal>
    </div >
  );
};

export default ReadingWritingModule;
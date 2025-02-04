function ExpertsSection() {
    const experts = [
      {
        id: 1,
        name: "Phan Nhật Anh",
        title: "Giảng viên Đại học Thomas Jefferson",
        img: "https://via.placeholder.com/100", // Replace with actual image
      },
      {
        id: 2,
        name: "Tommy Mottola",
        title: "Tiến Sỹ Hóa Học",
        img: "https://via.placeholder.com/100", // Replace with actual image
      },
      {
        id: 3,
        name: "Whitney Houston",
        title: "Giảng viên Học Viện Ngân Hàng",
        img: "https://via.placeholder.com/100", // Replace with actual image
      },
      {
        id: 4,
        name: "Mai Văn Túc",
        title: "Giảng viên Đại Học Quốc Gia Hà Nội",
        img: "https://via.placeholder.com/150", // Replace with actual image
        featured: true, // Mark this expert as featured
      },
      {
        id: 5,
        name: "Mariah Carey",
        title: "Thạc Sỹ Vật Lý",
        img: "https://via.placeholder.com/100", // Replace with actual image
      },
      {
        id: 6,
        name: "Jennifer Aniston",
        title: "Giảng viên Đại học Thomas Jefferson",
        img: "https://via.placeholder.com/100", // Replace with actual image
      },
    ];
  
    return (
      <section className="container my-5 text-center">
        <h2 className="fw-bold">
          Chuyên gia của <span className="text-warning">Future Me</span>
        </h2>
        <p className="text-muted">
          Với đội ngũ giáo viên, chuyên gia và vận hành chuyên nghiệp,<br></br> Future Me tự tin có thể đem đến những trải nghiệm thú vị và chất lượng cho các bạn.
        </p>
        <div className="row justify-content-center mt-5">
          {experts.map((expert) => (
            <div
              key={expert.id}
              className={`col-6 col-md-4 col-lg-2 mb-4 ${
                expert.featured ? "position-relative" : ""
              }`}
            >
              <div
                className={`card border-0 ${
                  expert.featured ? "p-3 shadow-lg" : "p-2"
                }`}
                style={{
                  borderRadius: expert.featured ? "15px" : "50%",
                  backgroundColor: expert.featured ? "#fff" : "transparent",
                }}
              >
                <img
                  src={expert.img}
                  alt={expert.name}
                  className="rounded-circle img-fluid"
                  style={{
                    border: expert.featured ? "4px solid gold" : "3px solid #ddd",
                  }}
                />
                <h5 className="mt-3">{expert.name}</h5>
                <p className="text-muted small">{expert.title}</p>
                {expert.featured && (
                  <div className="social-icons mt-2">
                    <a href="#" className="text-primary me-2">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="text-info me-2">
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a href="#" className="text-danger">
                      <i className="bi bi-instagram"></i>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default ExpertsSection;
  
function HeroSection() {
    return (
      <section className="container my-5">
        <div className="row align-items-center" style={{ minHeight: '100vh' }}>
          {/* Left Content */}
          <div className="col-lg-6">
            <h2 className="fw-bold">
              Cùng xem những <span className="text-warning">tính năng</span> thú vị của <span className="text-warning">Future Me</span>
            </h2>
            <p className="mt-4 text-muted">
              Bao gồm hệ thống trắc nghiệm dự đoán nghề nghiệp thích hợp. Từ đó cung cấp danh sách kiến thức, kỹ năng cần trang bị và chương trình học đi kèm. Ngoài ra Future Me còn giới thiệu đến bạn những cơ sở học tập uy tín và sự tư vấn đến từ những chuyên gia hay nhân vật thành công với nghề nghiệp nói trên.
            </p>
            <button className="btn main-btn mt-3">Xem chi tiết</button>
          </div>
  
          {/* Right Image */}
          <div className="col-lg-6 text-center">
            <img
              src="https://res-console.cloudinary.com/dbdcejpot/media_explorer_thumbnails/adac5a4d0db23d23b8ec5e646316d441/detailed" // Replace this with your image URL
              alt="Future Me"
              className="img-fluid shadow"
            />
          </div>
        </div>
      </section>
    );
  }
  
  export default HeroSection;
  
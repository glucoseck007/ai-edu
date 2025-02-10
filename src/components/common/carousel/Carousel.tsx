import { useEffect } from "react";

function Carousel() {
  useEffect(() => {
    const BasicSlider = $(".slider-active");
    BasicSlider.on("init", function (e) {
      const $firstAnimatingElements = $(".single-slider:first-child").find(
        "[data-animation]"
      );
      doAnimations($firstAnimatingElements);
    });
    BasicSlider.on(
      "beforeChange",
      function (
        e: JQuery.Event,
        slick: any,
        currentSlide: number,
        nextSlide: number
      ) {
        const $animatingElements = $(
          '.single-slider[data-slick-index="' + nextSlide + '"]'
        ).find("[data-animation]");
        doAnimations($animatingElements);
      }
    );
    (BasicSlider as any).slick({
      autoplay: true,
      autoplaySpeed: 10000,
      pauseOnHover: false,
      dots: false,
      fade: true,
      arrows: true,
      prevArrow: '<span class="prev"><i class="fa fa-angle-left"></i></span>',
      nextArrow: '<span class="next"><i class="fa fa-angle-right"></i></span>',
      responsive: [
        { breakpoint: 767, settings: { dots: false, arrows: false } },
      ],
    });
    function doAnimations(elements: JQuery<HTMLElement>) {
      const animationEndEvents =
        "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
      elements.each(function () {
        const $this = $(this);
        const $animationDelay = $this.data("delay");
        const $animationType = "animated " + $this.data("animation");
        $this.css({
          "animation-delay": $animationDelay,
          "-webkit-animation-delay": $animationDelay,
        });
        $this.addClass($animationType).one(animationEndEvents, function () {
          $this.removeClass($animationType);
        });
      });
    }
  }, []);
  return (
    <section id="slider-part" className="slider-active">
      <div
        className="single-slider bg_cover pt-150"
        style={{ backgroundImage: "url(./src/assets/images/bg1.png)" }}
        data-overlay="4"
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-9">
              <div className="slider-cont">
                <h1 data-animation="bounceInLeft" data-delay="1s">
                  Trải nghiệm học tập tuyệt vời
                </h1>
                <p data-animation="fadeInUp" data-delay="1.3s">
                  Website học tập dành cho trẻ em với nội dung phong phú, tương
                  tác sinh động và phương pháp giáo dục hiện đại. Giúp bé khám
                  phá thế giới qua các bài học trực quan, trò chơi bổ ích và bài
                  tập phát triển tư duy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="single-slider bg_cover pt-150"
        style={{ backgroundImage: "url(./src/assets/images/bg2.png)" }}
        data-overlay="4"
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-9">
              <div className="slider-cont">
                <h1 data-animation="bounceInLeft" data-delay="1s">
                  Học mà chơi, chơi mà học!
                </h1>
                <p data-animation="fadeInUp" data-delay="1.3s">
                  🔹 Bài học đa dạng: Toán, Tiếng Việt, Tiếng Anh, Khoa học...{" "}
                  <br />
                  🔹 Trò chơi giáo dục hấp dẫn giúp bé ghi nhớ nhanh <br />
                  🔹 Video hoạt hình sinh động giúp bé tiếp thu dễ dàng <br />
                  🔹 Bài tập phát triển tư duy, kỹ năng giải quyết vấn đề
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Carousel;

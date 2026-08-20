import {
  ArrowRight,
  Check,
  Cpu,
  Gauge,
  Layers,
  LockKeyhole,
  MousePointer2,
  PiggyBank,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { ParallaxHero } from "@/components/parallax-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const steps = [
  { number: "01", title: "Mô tả nhu cầu", text: "Nhập mục tiêu công việc hoặc dự án bằng ngôn ngữ tự nhiên." },
  { number: "02", title: "Phân tích yêu cầu", text: "Hệ thống tự động chia nhỏ bước thực hiện và xác định năng lực AI cần thiết." },
  { number: "03", title: "Đối chiếu dữ liệu", text: "So sánh tính năng, chi phí, tốc độ và bảo mật của hàng nghìn mô hình AI." },
  { number: "04", title: "Xuất AI Stack", text: "Nhận danh sách công cụ tối ưu kèm tổng chi phí đăng ký hàng tháng." },
];

const checks = [
  { code: "01", icon: TargetIcon, title: "Độ Phù Hợp Tính Năng", text: "Loại bỏ công cụ không đủ năng lực xử lý hoặc đánh dấu mức độ đáp ứng cụ thể." },
  { code: "02", icon: Gauge, title: "Đã Qua Kiểm Định", text: "Đánh giá chất lượng thực tế dựa trên benchmark tiêu chuẩn thay vì xếp hạng cảm tính." },
  { code: "03", icon: PiggyBank, title: "Tối Ưu Chi Phí", text: "Tính toán chi tiết giá đăng ký gói & chi phí theo mức độ sử dụng để tiết kiệm ngân sách." },
  { code: "04", icon: Zap, title: "Tốc Độ Phản Hồi", text: "Đảm bảo thời gian phản hồi đáp ứng tiến độ công việc thực tế." },
  { code: "05", icon: LockKeyhole, title: "An Toàn Dữ Liệu", text: "Kiểm tra chính sách bảo mật, vị trí dữ liệu và quyền thương mại trước khi đề xuất." },
  { code: "06", icon: RefreshCw, title: "Cập Nhật Liên Tục", text: "Dữ liệu nguồn được kiểm định và trích dẫn theo mốc thời gian rõ ràng." },
];

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Search {...props} />;
}

const faqs = [
  ["Tôi có cần kiến thức AI trước khi sử dụng không?", "Không. Bạn chỉ cần mô tả công việc của mình. BENCHFLOW sẽ dịch nhu cầu đó thành tiêu chí kỹ thuật và đưa ra đề xuất rõ ràng."],
  ["BENCHFLOW đánh giá công cụ dựa trên yếu tố nào?", "Dữ liệu được tổng hợp từ benchmark kiểm định thực tế, chi phí niêm yết, chính sách bảo mật và khả năng hỗ trợ tác vụ."],
  ["Nếu một công cụ không hoàn thành hết tác vụ thì sao?", "BENCHFLOW sẽ kết hợp chuỗi nhiều công cụ bổ trợ cho nhau và tổng hợp toàn bộ chi phí trong một bảng quản lý duy nhất."],
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="minimal-landing">
        {/* Minimal Hero Section */}
        <ParallaxHero>
          <div className="minimal-hero-copy">
            <span className="mono-badge">[ SYSTEM ADVISOR ]</span>
            <h1>BUILD THE RIGHT AI STACK.</h1>
            <p>
              Mô tả nhiệm vụ công việc. BENCHFLOW tự động so sánh tính năng, hiệu năng và chi phí để đề xuất bộ công cụ AI tối ưu nhất.
            </p>
            <div className="hero-btn-group">
              <Link href="/sign-up" className="minimal-btn minimal-btn-dark">
                <span>Tạo AI Strategy</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#how-it-works" className="minimal-btn minimal-btn-outline">
                <span>Xem quy trình</span>
              </Link>
            </div>
          </div>
        </ParallaxHero>

        {/* Section 1: Introduction (Inspired by Rational Lab Grid Layout) */}
        <section className="minimal-section border-top" id="overview">
          <div className="section-grid-header">
            <span className="section-tag">[ 01 / OVERVIEW ]</span>
            <h2>BENCHFLOW hoạt động như thế nào?</h2>
          </div>
          <div className="overview-two-col">
            <p className="lead-text">
              BENCHFLOW giải quyết bài toán lựa chọn công cụ AI giữa hàng nghìn giải pháp rải rác trên thị trường. Chúng tôi giúp bạn chọn đúng công cụ, đúng gói cước và minh bạch mọi khoản chi phí.
            </p>
            <div className="overview-bullet-list">
              <div className="bullet-item">
                <Check className="w-4 h-4 text-black flex-none" />
                <span>Không tốn ngân sách cho công cụ dư thừa</span>
              </div>
              <div className="bullet-item">
                <Check className="w-4 h-4 text-black flex-none" />
                <span>Đã kiểm định khả năng bảo mật &amp; bản quyền</span>
              </div>
              <div className="bullet-item">
                <Check className="w-4 h-4 text-black flex-none" />
                <span>Cập nhật liên tục theo biến động giá thực tế</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Process Steps (Inspired by MYDNA / Rational Lab large numbers 01, 02, 03) */}
        <section className="minimal-section border-top" id="how-it-works">
          <div className="section-grid-header">
            <span className="section-tag">[ 02 / PROCESS ]</span>
            <h2>Quy trình 4 bước đơn giản</h2>
          </div>
          <div className="process-cards-grid">
            {steps.map(({ number, title, text }) => (
              <article key={number} className="minimal-card">
                <span className="card-number-badge">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Section 3: Evaluation Criteria Bento Grid */}
        <section className="minimal-section border-top">
          <div className="section-grid-header">
            <span className="section-tag">[ 03 / CRITERIA ]</span>
            <h2>6 tiêu chí kiểm định nghiêm ngặt</h2>
          </div>
          <div className="criteria-grid">
            {checks.map(({ code, icon: Icon, title, text }) => (
              <article key={code} className="criteria-card">
                <header>
                  <span className="mono-code">[{code}]</span>
                  <Icon className="w-4 h-4 text-black" />
                </header>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Section 4: Live Strategy Table */}
        <section className="minimal-section border-top">
          <div className="section-grid-header">
            <span className="section-tag">[ 04 / DEMO STACK ]</span>
            <h2>Mẫu chiến lược AI hoàn chỉnh</h2>
          </div>
          <div className="minimal-table-wrapper">
            <table className="minimal-table">
              <thead>
                <tr>
                  <th>Nhiệm vụ</th>
                  <th>Công cụ đề xuất</th>
                  <th>Lý do chọn</th>
                  <th>Gói cước</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Nghiên cứu &amp; Tổng hợp</strong></td>
                  <td>Perplexity Pro / Claude 3.5</td>
                  <td>Có nguồn trích dẫn live chuẩn xác</td>
                  <td><span className="table-badge">Pro</span></td>
                </tr>
                <tr>
                  <td><strong>Soạn thảo &amp; Code</strong></td>
                  <td>DeepSeek R1 / GPT-4o</td>
                  <td>Logic lập luận cao, hỗ trợ context lớn</td>
                  <td><span className="table-badge">Included</span></td>
                </tr>
                <tr>
                  <td><strong>Tạo hình ảnh asset</strong></td>
                  <td>Midjourney v6</td>
                  <td>Chất lượng hình ảnh đồng bộ cao</td>
                  <td><span className="table-badge">Standard</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Pricing */}
        <section className="minimal-section border-top" id="pricing">
          <div className="section-grid-header">
            <span className="section-tag">[ 05 / PRICING ]</span>
            <h2>Bảng giá minh bạch</h2>
          </div>
          <div className="pricing-minimal-grid">
            <article className="pricing-card">
              <span className="plan-label">Free</span>
              <div className="plan-price">$0</div>
              <p>Phân tích 1 tác vụ công việc và nhận bản tóm tắt cơ bản.</p>
              <Link href="/sign-up" className="minimal-btn minimal-btn-outline full-width">Bắt đầu</Link>
            </article>

            <article className="pricing-card featured">
              <span className="plan-label featured-label">[ Most Popular ]</span>
              <div className="plan-price">$19 <small>/tháng</small></div>
              <p>Đầy đủ chiến lược AI, công cụ thay thế &amp; quy trình làm việc hàng tháng.</p>
              <Link href="/pricing" className="minimal-btn minimal-btn-dark full-width">Chọn gói Plus</Link>
            </article>

            <article className="pricing-card">
              <span className="plan-label">Team</span>
              <div className="plan-price">$49 <small>/tháng</small></div>
              <p>Quản lý nhóm, chia sẻ chiến lược &amp; tối ưu chi phí công nghệ cho team.</p>
              <Link href="/pricing" className="minimal-btn minimal-btn-outline full-width">Chọn gói Team</Link>
            </article>
          </div>
        </section>

        {/* Section 6: FAQ */}
        <section className="minimal-section border-top">
          <div className="section-grid-header">
            <span className="section-tag">[ 06 / FAQ ]</span>
            <h2>Câu hỏi thường gặp</h2>
          </div>
          <div className="faq-minimal-list">
            {faqs.map(([q, a]) => (
              <details key={q} className="faq-item">
                <summary>
                  <span>{q}</span>
                  <span className="faq-icon">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="minimal-cta-section border-top">
          <div className="cta-box">
            <span className="mono-badge">[ GET STARTED ]</span>
            <h2>Sẵn sàng xây dựng AI Stack tối ưu?</h2>
            <p>Bắt đầu ngay hôm nay để tiết kiệm thời gian và ngân sách công nghệ.</p>
            <Link href="/sign-up" className="minimal-btn minimal-btn-dark">
              <span>Tạo AI Strategy ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

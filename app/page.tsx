import {
  ArrowRight,
  Check,
  Gauge,
  Layers3,
  LockKeyhole,
  MousePointer2,
  PiggyBank,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
  Cpu,
  Layers,
  Sparkle
} from "lucide-react";
import Link from "next/link";
import { ParallaxHero } from "@/components/parallax-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

const steps = [
  { number: "01", icon: MousePointer2, title: "1. Mô tả nhu cầu của bạn", text: "Chỉ cần giải thích mục tiêu công việc hoặc dự án bằng ngôn ngữ tự nhiên, không cần thuật ngữ phức tạp." },
  { number: "02", icon: Layers3, title: "2. Duyệt qua lộ trình", text: "BENCHFLOW phân tích và chia nhỏ các bước thực hiện công việc để xác định đúng loại AI cần sử dụng." },
  { number: "03", icon: Search, title: "3. So sánh công cụ tối ưu", text: "Hệ thống đối chiếu tính năng, tốc độ, giá cả, bảo mật và quyền truy cập của hàng nghìn mô hình AI." },
  { number: "04", icon: ShieldCheck, title: "4. Nhận Stack AI hoàn chỉnh", text: "Xuất báo cáo bộ công cụ AI tối ưu nhất, kèm chi phí đăng ký hàng tháng và lý do lựa chọn cụ thể." },
];

const checks = [
  { icon: Target, title: "Độ Phù Hợp Tính Năng", text: "Loại bỏ những công cụ thiếu khả năng xử lý hoặc đánh dấu rõ mức độ đáp ứng công việc." },
  { icon: Gauge, title: "Chất Lượng Đã Kiểm Chứng", text: "Đánh giá chất lượng thực tế theo bài test bài bản thay vì bảng xếp hạng chung chung." },
  { icon: PiggyBank, title: "Tối Ưu Ngân Sách", text: "Hiển thị minh bạch giá đăng ký gói & chi phí dùng theo lượng request để tối đa hóa ngân sách." },
  { icon: Zap, title: "Tốc Độ & Phản Hồi", text: "Đảm bảo thời gian xử lý đáp ứng tốt tiến độ dự án mà không bị nghẽn mạng." },
  { icon: LockKeyhole, title: "Bảo Mật Dữ Liệu", text: "Kiểm tra quyền riêng tư, vị trí máy chủ và bản quyền thương mại trước khi đề xuất." },
  { icon: RefreshCw, title: "Dữ Liệu Cập Nhật", text: "Dữ liệu được cập nhật liên tục từ các nguồn có mốc thời gian rõ ràng." },
];

const faqs = [
  ["Tôi có cần kiến thức về các công cụ AI trước khi dùng không?", "Không cần. Bạn chỉ cần mô tả công việc của mình. BENCHFLOW tự động dịch nhu cầu đó thành các tiêu chí kỹ thuật và đưa ra đề xuất bằng tiếng Việt / tiếng Anh dễ hiểu."],
  ["AI có tự quyết định hoàn toàn không?", "Không. Quy tắc kiểm định rõ ràng của BENCHFLOW sẽ đối chiếu tính năng, ngân sách và quyền truy cập trước khi sắp xếp thứ tự khuyến nghị cho bạn."],
  ["Nếu một công cụ không hoàn thành hết dự án thì sao?", "BENCHFLOW sẽ kết hợp một chuỗi các công cụ AI bổ trợ cho nhau, giải thích rõ công cụ nào đảm nhận bước nào và tính tổng chi phí đăng ký trong cùng một bảng duy nhất."],
  ["Tôi có thể thay đổi quy trình làm việc sau này không?", "Có. Các chiến lược lưu lại có thể chỉnh sửa lại quy trình bất cứ lúc nào khi nhu cầu công việc của bạn thay đổi."],
];

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="landing-page">
        {/* Spatial Parallax Hero Section */}
        <ParallaxHero>
          <div className="spatial-hero-copy">
            <span className="hero-eyebrow">
              <Sparkles className="w-3.5 h-3.5" /> AI STACK ADVISOR · CỐ VẤN AI DOANH NGHIỆP
            </span>
            <h1>Where AI Stack Grows.</h1>
            <h2>Hệ sinh thái AI thông minh &amp; tối ưu cho công việc.</h2>
            <p>
              Mô tả nhiệm vụ của bạn. BENCHFLOW so sánh hàng trăm công cụ AI, gói cước và chi phí, sau đó tổng hợp thành chiến lược công cụ hoàn hảo nhất.
            </p>
            <div className="hero-actions">
              <Button asChild size="lg" className="button-pill-primary">
                <Link href="/sign-up">
                  <span>Tạo AI Strategy ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="button-pill-glass">
                <Link href="#how-it-works">Khám phá cách hoạt động</Link>
              </Button>
            </div>
            <div className="trust-line">
              <span><Check /> Không cần kiến thức AI rườm rà</span>
              <span><Check /> Lý do kiểm chứng rõ ràng</span>
              <span><Check /> Quản lý chi phí 1 chỗ</span>
            </div>
          </div>

          <div className="hero-signal" aria-label="BENCHFLOW checks capability, quality, price, and access">
            <span><i /> Dữ liệu đã qua kiểm định</span>
            <strong>Nhập 1 nhiệm vụ. Xuất 1 Stack AI hoàn chỉnh.</strong>
          </div>
        </ParallaxHero>

        {/* What is BENCHFLOW Section - Inspired by BloomFi "What is USD Bloom?" */}
        <section className="bloom-intro-section section" id="what-is">
          <div className="bloom-intro-grid">
            <div className="bloom-intro-left">
              <h2>BENCHFLOW là gì?</h2>
              <Link className="button button-pill-dark button-small" href="/sign-up">
                <span>Khám phá ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="bloom-intro-right">
              <p>
                BENCHFLOW là nền tảng cố vấn bộ công cụ AI thông minh giúp cá nhân và doanh nghiệp tìm ra đúng công cụ, đúng gói cước và mức giá hợp lý nhất cho mọi tác vụ công việc — đảm bảo hiệu suất tối đa mà không tốn ngân sách lãng phí.
              </p>
            </div>
          </div>

          {/* 3-Column Glass Bento Grid Inspired by Reference BloomFi & Thala */}
          <div className="bloom-cards-grid">
            <article className="bloom-card card-lavender">
              <div className="card-top-icon">
                <div className="flower-abstract-badge">
                  <Sparkle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3>Tối Ưu Ngân Sách AI</h3>
              <p>
                Tự động tính toán các gói cước (Free, Plus, Pro) để xây dựng bộ công cụ tiết kiệm chi phí nhất cho doanh nghiệp của bạn.
              </p>
            </article>

            <article className="bloom-card card-dark-thala thala-glow-cyan">
              <div className="top-glow-bar bar-cyan" />
              <div className="card-top-icon">
                <Cpu className="w-5 h-5 text-cyan-400" />
              </div>
              <h3>Minh Bạch &amp; Ổn Định</h3>
              <p>
                Đánh giá độ phù hợp dựa trên benchmark thực tế, quy định quyền riêng tư và tốc độ xử lý trước khi đưa ra đề xuất.
              </p>
            </article>

            <article className="bloom-card card-dark-thala thala-glow-purple">
              <div className="top-glow-bar bar-purple" />
              <div className="card-top-icon">
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <h3>Tự Động 100% Rõ Ràng</h3>
              <p>
                Không còn phải tự mình thử nghiệm hàng tá công cụ rải rác. Nhận ngay báo cáo tích hợp rõ ràng chỉ trong vài giây.
              </p>
            </article>
          </div>
        </section>

        {/* Backed By & Ecosystem Bar Inspired by Reference 1 */}
        <section className="ecosystem-strip-section">
          <div className="section ecosystem-inner">
            <span className="strip-label">ĐƯỢC KIỂM ĐỊNH TRÊN HỆ SINH THÁI AI HÀNG ĐẦU</span>
            <div className="strip-logos">
              <span>OpenAI</span>
              <span>Anthropic Claude</span>
              <span>Google Gemini</span>
              <span>DeepSeek</span>
              <span>Perplexity</span>
              <span>Midjourney</span>
              <span>Stripe</span>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="landing-intro section" id="how-it-works">
          <div className="section-heading">
            <span className="kicker">Quy trình làm việc</span>
            <h2>Từ ý tưởng ban đầu đến kế hoạch thực thi rõ ràng.</h2>
            <p>BENCHFLOW đảm nhận việc so sánh kỹ thuật phức tạp. Bạn giữ quyền làm chủ mục tiêu và quyết định cuối cùng.</p>
          </div>
          <div className="workflow-track">
            {steps.map(({ number, icon: Icon, title, text }) => (
              <article key={number} className="workflow-glass-card">
                <header>
                  <span>{number}</span>
                  <Icon className="w-5 h-5 text-purple-500" />
                </header>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Use Cases Section - Inspired by BloomFi Business Card & Thala Cards */}
        <section className="use-mode-band" id="use-cases">
          <div className="section use-mode-inner">
            <div className="section-heading">
              <span className="kicker">Ứng dụng đa dạng</span>
              <h2>Cho dự án cá nhân hoặc quy trình lặp lại hàng tháng.</h2>
            </div>
            <div className="use-mode-grid">
              <article className="glass-mode-card">
                <div className="mode-number">01</div>
                <MousePointer2 className="w-6 h-6 text-purple-500 mb-2" />
                <small>Cho kết quả nhanh chóng</small>
                <h3>Project Đơn Lẻ (One-off Project)</h3>
                <p>Lên kế hoạch cho đợt ra mắt, bài nghiên cứu, video, website hay dự án có thời hạn và ngân sách cụ thể.</p>
                <Link href="/sign-up" className="mode-link">
                  <span>Lên kế hoạch dự án</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </article>

              <article className="glass-mode-card">
                <div className="mode-number">02</div>
                <RefreshCw className="w-6 h-6 text-cyan-400 mb-2" />
                <small>Cho công việc định kỳ</small>
                <h3>Quy Trình Hàng Tháng (Monthly Workflow)</h3>
                <p>Tối ưu bộ công cụ AI cho các tác vụ đội ngũ của bạn lặp lại hàng tuần hoặc hàng tháng.</p>
                <Link href="/sign-up" className="mode-link">
                  <span>Tối ưu quy trình tháng</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* Evidence Bento Section */}
        <section className="evidence-band">
          <div className="section evidence-inner">
            <div className="section-heading light">
              <span className="kicker">Tiêu chí đánh giá</span>
              <h2>Một đề xuất tốt phải hoạt động hiệu quả ngoài thực tế.</h2>
              <p>Mọi lựa chọn công cụ phải thực sự phù hợp với mục tiêu và cách bạn vận hành công việc.</p>
            </div>
            <div className="evidence-bento">
              {checks.map(({ icon: Icon, title, text }, index) => (
                <article className={`evidence-tile evidence-tile-${index + 1}`} key={title}>
                  <Icon className="w-5 h-5" />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Strategy Preview Section */}
        <section className="strategy-preview section">
          <div className="section-heading">
            <span className="kicker">Chiến lược hoàn chỉnh</span>
            <h2>Biết rõ cần dùng công cụ nào, mua gói nào &amp; chi phí ra sao.</h2>
            <p>Báo cáo trực quan hợp nhất từng khuyến nghị công cụ và bảng phân bổ ngân sách đăng ký.</p>
          </div>
          <div className="strategy-table-glass" aria-label="Bảng xem trước chiến lược BENCHFLOW">
            <header>
              <span>Nhiệm vụ</span>
              <span>Cấu hình khuyến nghị</span>
              <span>Lý do phù hợp</span>
              <span>Gói đề xuất</span>
            </header>
            <div>
              <strong>Nghiên cứu &amp; Tổng hợp</strong>
              <span>Perplexity Pro / Claude 3.5</span>
              <span>Cập nhật nguồn live có trích dẫn chuẩn xác</span>
              <b className="badge-plan pro">Pro</b>
            </div>
            <div>
              <strong>Viết content &amp; Code</strong>
              <span>DeepSeek R1 / GPT-4o</span>
              <span>Khả năng logic vượt trội &amp; hỗ trợ context lớn</span>
              <b className="badge-plan included">Gói sẵn có</b>
            </div>
            <div>
              <strong>Tạo hình ảnh &amp; Asset</strong>
              <span>Midjourney v6 / Recraft</span>
              <span>Tạo hình ảnh đồng bộ chất lượng cao cho campaign</span>
              <b className="badge-plan standard">Standard</b>
            </div>
            <footer>
              <span>Tổng chi phí ước tính hàng tháng</span>
              <strong>$20 / tháng (Tránh trùng lặp các gói mua lẻ)</strong>
            </footer>
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section className="section pricing-preview landing-pricing">
          <div className="section-heading">
            <span className="kicker">Bảng giá minh bạch</span>
            <h2>Bắt đầu miễn phí. Nâng cấp khi bạn muốn mở rộng.</h2>
          </div>
          <div className="preview-plans">
            <article className="glass-plan-card">
              <small>Miễn phí</small>
              <h3>$0</h3>
              <p>Phân tích 1 tác vụ công việc và nhận bản tóm tắt đề xuất công cụ AI cơ bản.</p>
              <Link className="button button-secondary button-pill" href="/sign-up">Bắt đầu ngay</Link>
            </article>

            <article className="glass-plan-card featured">
              <span className="popular-badge">Được ưa chuộng nhất</span>
              <small>Plus</small>
              <h3>$19<em>/tháng</em></h3>
              <p>Đầy đủ chiến lược AI, công cụ thay thế, lưu trữ không giới hạn &amp; quy trình hàng tháng.</p>
              <Link className="button button-primary button-pill" href="/pricing">Dùng thử gói Plus</Link>
            </article>

            <article className="glass-plan-card">
              <small>Đội ngũ (Team)</small>
              <h3>$49<em>/tháng</em></h3>
              <p>Chia sẻ chiến lược, quản lý nhóm &amp; tối ưu ngân sách công nghệ cho nhóm nhỏ.</p>
              <Link className="button button-secondary button-pill" href="/pricing">Xem gói Team</Link>
            </article>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section faq landing-faq">
          <div className="section-heading">
            <span className="kicker">Câu hỏi thường gặp</span>
            <h2>Những điều bạn cần biết.</h2>
          </div>
          <div className="faq-accordion-list">
            {faqs.map(([question, answer]) => (
              <details key={question} className="faq-glass-item">
                <summary>
                  <span>{question}</span>
                  <span className="faq-plus">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta">
          <div className="section final-cta-inner glass-cta-box">
            <span className="kicker">Sẵn sàng tối ưu ngay</span>
            <h2>Biến nhiệm vụ tiếp theo thành chiến lược AI rõ ràng.</h2>
            <p>Bắt đầu từ công việc của bạn. BENCHFLOW sẽ giúp bạn chọn công cụ hoàn hảo nhất.</p>
            <Button asChild size="lg" className="button-pill-primary">
              <Link href="/sign-up">
                <span>Tạo AI Strategy của tôi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

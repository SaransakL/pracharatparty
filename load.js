document.addEventListener("DOMContentLoaded", () => {

  // ================= SLIDER =================

  const slides = document.querySelector('.slides');
  const slide = document.querySelectorAll('.slide');

  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');
  const dotsContainer = document.querySelector('.dots');

  let index = 0;

  // สร้างจุด
  if (dotsContainer && slide.length > 0) {

    slide.forEach((_, i) => {

      const dot = document.createElement('div');

      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);

      dot.addEventListener('click', () => {
        index = i;
        updateSlide();
      });

      dotsContainer.appendChild(dot);

    });

  }

  const dots = document.querySelectorAll('.dot');

  function updateSlide() {

    if (!slides) return;

    slides.style.transform =
      `translateX(-${index * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

  }

  if (nextBtn && slide.length > 0) {

    nextBtn.onclick = () => {

      index = (index + 1) % slide.length;

      updateSlide();

    };

  }

  if (prevBtn && slide.length > 0) {

    prevBtn.onclick = () => {

      index = (index - 1 + slide.length) % slide.length;

      updateSlide();

    };

  }

  // เริ่มต้นที่ Slide แรก
  updateSlide();

  // ================= LOAD POLICY =================
  async function loadPolicies() {
    try {
      const res = await fetch('policy.json');
      const data = await res.json();

      const grid = document.getElementById('policyGrid');
      if (!grid) return;

      data.forEach((policy) => {
        const item = document.createElement('div');
        item.className = 'accordion-item';

        item.innerHTML = `
          <div class="accordion-header">
            <h3>${policy.title}</h3>
            <span class="icon"><i class="bi bi-plus"></i></span>
          </div>
          <div class="accordion-content">
            <p>${policy.description}</p>
          </div>
        `;

        const header = item.querySelector('.accordion-header');
        header.onclick = () => {
          item.classList.toggle('active');
        };

        grid.appendChild(item);
      });

    } catch (err) {
      console.error("โหลด policy ไม่ได้:", err);
    }
  }

  loadPolicies();

  // ================= LOAD HEADER/FOOTER =================

  const components = {
    "header": "header.html",
    "footer": "footer.html",
  };

  function loadHTML(divId, file) {
    fetch(file)
      .then(response => {
        if (!response.ok) throw new Error(`ไม่สามารถโหลด ${file} ได้`);
        return response.text();
      })
      .then(html => {
        document.getElementById(divId).innerHTML = html;
      })
      .catch(err => console.error(err));
  }

  for (const [divId, file] of Object.entries(components)) {
    loadHTML(divId, file);
  }


  // ================= MENU =================

  window.toggleMenu = function () {

    const offcanvas =
      document.getElementById("offcanvas");

    if (offcanvas) {

      offcanvas.classList.toggle("active");

      if (!offcanvas.classList.contains("active")) {

        offcanvas.classList.remove("submenu-open");

        offcanvas
          .querySelectorAll(".submenu-page")
          .forEach(page =>
            page.classList.remove("show")
          );

      }

    }

  };


  // ปิดเมื่อคลิกข้างนอก
  document.addEventListener("click", function (e) {

    const offcanvas =
      document.getElementById("offcanvas");

    const menuBtn =
      document.querySelector(".menu-btn");

    if (
      offcanvas &&
      menuBtn &&
      offcanvas.classList.contains("active") &&
      !offcanvas.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {

      offcanvas.classList.remove("active");
      offcanvas.classList.remove("submenu-open");

      offcanvas
        .querySelectorAll(".submenu-page")
        .forEach(page =>
          page.classList.remove("show")
        );

    }

  });


  // เปิด submenu
  window.openSubmenu = function (e, id) {

    e.preventDefault();

    const offcanvas =
      document.getElementById("offcanvas");

    const submenu =
      document.getElementById(id);

    if (!offcanvas || !submenu) return;

    offcanvas
      .querySelectorAll(".submenu-page")
      .forEach(page =>
        page.classList.remove("show")
      );

    submenu.classList.add("show");

    offcanvas.classList.add("submenu-open");

  };


  // กลับหน้าหลัก
  window.closeSubmenu = function () {

    const offcanvas =
      document.getElementById("offcanvas");

    if (!offcanvas) return;

    offcanvas.classList.remove("submenu-open");

    offcanvas
      .querySelectorAll(".submenu-page")
      .forEach(page =>
        page.classList.remove("show")
      );

  };

  // ================= COPY =================

  const copyBtn =
    document.getElementById("copy-link");

  if (copyBtn) {

    copyBtn.addEventListener("click", () => {

      navigator.clipboard.writeText(
        window.location.href
      );

      const status =
        document.getElementById("copy-status");

      if (status) {

        status.classList.add("show");

        setTimeout(() => {

          status.classList.remove("show");

        }, 2000);

      }

    });

  }


  // ================= CONTACT =================

  const contactForm =
    document.getElementById("contactForm");

  if (contactForm) {

    /*
     * ใส่ Discord Webhook URL ตรงนี้
     */
    const webhookURL =
      "https://discord.com/api/webhooks/1548392579014459544/f_WBYJaAv237Jj1coV0Xx2X569KgdhMMrzjuuyynwJT19nueJrFiW985NMET-PERothq";


    contactForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        // ================= GET FORM =================

        const name =
          document
            .getElementById("name")
            .value
            .trim();

        const discord =
          document
            .getElementById("discord")
            .value
            .trim();

        const subject =
          document
            .getElementById("subject")
            .value
            .trim();

        const message =
          document
            .getElementById("message")
            .value
            .trim();


        // ================= ELEMENTS =================

        const button =
          document.getElementById(
            "submitButton"
          );

        const success =
          document.getElementById(
            "successMessage"
          );

        const error =
          document.getElementById(
            "errorMessage"
          );


        // ================= RESET MESSAGE =================

        if (success) {
          success.style.display = "none";
        }

        if (error) {
          error.style.display = "none";
        }


        // ================= LOADING =================

        if (button) {

          button.disabled = true;

          button.innerHTML = `
            <i class="bi bi-hourglass-split"></i>
            กำลังส่ง...
          `;

        }


        // ================= DISCORD DATA =================

        const data = {

          allowed_mentions: {
            parse: ["users"]
          },

          embeds: [

            {

              title:
                "มีข้อความใหม่จากเว็บไซต์",

              color: 16412436,

              fields: [

                {
                  name: "ชื่อ",

                  value:
                    name || "-",

                  inline: true
                },

                {
                  name: "Discord",
                  value: `${discord}`,
                  inline: true },

                {
                  name: "หัวข้อ",

                  value:
                    subject || "-",

                  inline: false
                },

                {
                  name: "ข้อความ",

                  value:
                    message || "-",

                  inline: false
                }

              ],

              timestamp:
                new Date().toISOString()

            }

          ]

        };


        // ================= SEND =================

        try {

          const response =
            await fetch(
              webhookURL,
              {

                method: "POST",

                headers: {

                  "Content-Type":
                    "application/json"

                },

                body:
                  JSON.stringify(data)

              }
            );


          // ================= SUCCESS =================

          if (response.ok) {

            if (success) {

              success.style.display =
                "block";

            }

            contactForm.reset();

          }

          // ================= ERROR =================

          else {

            if (error) {

              error.style.display =
                "block";

            }

          }


        } catch (err) {

          console.error(
            "Discord Webhook Error:",
            err
          );

          if (error) {

            error.style.display =
              "block";

          }

        }


        // ================= RESET BUTTON =================

        if (button) {

          button.disabled = false;

          button.innerHTML = `
            <i class="bi bi-send-fill"></i>
            ส่งข้อความ
          `;

        }

      }

    );

  }

  const policyCards = document.querySelectorAll('.policy-card');

const policyModal = document.getElementById('policyModal');
const policyModalClose = document.getElementById('policyModalClose');
const policyModalBackdrop = document.querySelector('.policy-modal-backdrop');

const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');


function openPolicyModal(card) {

    const title = card.dataset.title;
    const description = card.dataset.description;

    modalTitle.textContent = title;
    modalDescription.textContent = description;

    policyModal.classList.add('active');

    document.body.style.overflow = 'hidden';
}


function closePolicyModal() {

    policyModal.classList.remove('active');

    document.body.style.overflow = '';
}


policyCards.forEach(card => {

    card.addEventListener('click', () => {
        openPolicyModal(card);
    });

});


policyModalClose.addEventListener('click', closePolicyModal);

policyModalBackdrop.addEventListener('click', closePolicyModal);


document.addEventListener('keydown', (event) => {

    if (event.key === 'Escape') {
        closePolicyModal();
    }

});

});
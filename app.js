// ===== USJ Journey 2026 - App Logic =====

function navigateTo(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Show target page
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === pageId) {
      item.classList.add('active');
    }
  });
}

function switchDay(day, btn) {
  // Hide all day contents
  document.querySelectorAll('.day-content').forEach(d => {
    d.classList.remove('active');
  });

  // Show selected day
  const target = document.getElementById('day-' + day);
  if (target) {
    target.classList.add('active');
  }

  // Update tabs
  document.querySelectorAll('.day-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  if (btn) {
    btn.classList.add('active');
  }
}

// ===== Intersection Observer for scroll animations =====
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  // Observe animatable elements
  const animatables = document.querySelectorAll(
    '.highlight-card, .plan-card, .timeline-item, .restaurant-card, .quick-eat-card, .tip-item, .compare-table'
  );

  animatables.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `all 0.5s ease ${i % 4 * 0.08}s`;
    observer.observe(el);
  });
}

// ===== Add animate-in class styles =====
function injectAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// ===== Touch feedback on cards =====
function initTouchFeedback() {
  const cards = document.querySelectorAll(
    '.highlight-card, .plan-card, .restaurant-card, .quick-eat-card, .tip-item, .nav-item, .day-tab'
  );

  cards.forEach(card => {
    card.addEventListener('touchstart', () => {
      card.style.transform = 'scale(0.97)';
    }, { passive: true });

    card.addEventListener('touchend', () => {
      card.style.transform = '';
    }, { passive: true });
  });
}

// ===== Parallax on hero =====
function initHeroParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < 400) {
      hero.style.transform = `translateY(${scrollY * 0.15}px)`;
      hero.style.opacity = 1 - scrollY / 500;
    }
  }, { passive: true });
}

// ===== Plan selection feedback =====
function initPlanButtons() {
  document.querySelectorAll('.plan-select-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const original = this.textContent;
      this.textContent = '✓ 選択済み';
      this.disabled = true;
      this.style.opacity = '0.7';

      // Reset other buttons
      document.querySelectorAll('.plan-select-btn').forEach(other => {
        if (other !== this) {
          other.textContent = 'このプランを選ぶ';
          other.disabled = false;
          other.style.opacity = '1';
        }
      });
    });
  });
}

// ===== Modal for Plan Details =====
const planData = {
  economy: {
    title: 'エコノミープラン 明細',
    subtitle: '大人2名 + 子供1名（5歳） ／ 2026年9月',
    sections: [
      {
        label: '🚗 交通費',
        items: [
          ['高速道路（徳島⇔大阪 往復）', '¥8,400'],
          ['ガソリン代（往復 約300km）', '¥5,000'],
          ['駐車場（パーク周辺 1日分）', '¥3,000']
        ]
      },
      {
        label: '🏨 宿泊',
        items: [
          ['西九条エリアホテル（1泊 / 1室）', '¥12,000']
        ]
      },
      {
        label: '🎢 チケット',
        items: [
          ['1デイ・スタジオ・パス 大人×2', '¥17,200'],
          ['1デイ・スタジオ・パス 子供×1', '¥5,600']
        ]
      },
      {
        label: '🍽️ 食事（概算）',
        items: [
          ['パーク内ランチ（3名）', '¥6,000'],
          ['夕食（周辺レストラン 3名）', '¥6,000'],
          ['2日目ランチ（道頓堀 3名）', '¥5,000'],
          ['軽食・ドリンク（2日分）', '¥4,000']
        ]
      },
      {
        label: '🎡 観光',
        items: [
          ['海遊館 大人×2', '¥4,800'],
          ['海遊館 子供×1', '¥2,000'],
          ['梅田スカイビル 大人×2', '¥3,000'],
          ['梅田スカイビル 子供×1', '無料']
        ]
      },
      {
        label: '🛍️ その他',
        items: [
          ['パワーアップバンド（子供用）', '¥3,800'],
          ['お土産・雑費', '¥5,000']
        ]
      }
    ],
    subtotal: '¥90,800',
    note: '※ 上記は概算です。実際の料金は変動する場合があります。\n※ エコノミープランの表示価格「¥120,000」は予備費込みの上限目安です。',
    express: {
      label: '⚡ エクスプレスパス追加（母+子 2名分）',
      items: [
        ['エクスプレスパス 大人×1', '¥12,800'],
        ['エクスプレスパス 子供×1', '¥12,800']
      ],
      subtotal: '¥25,600',
      total: '¥116,400'
    }
  },
  standard: {
    title: 'スタンダードプラン 明細',
    subtitle: '大人2名 + 子供1名（5歳） ／ 2026年9月',
    sections: [
      {
        label: '🚗 交通費',
        items: [
          ['高速道路（徳島⇔大阪 往復）', '¥8,400'],
          ['ガソリン代（往復 約300km）', '¥5,000'],
          ['駐車場（パーク直結 1日分）', '¥5,000']
        ]
      },
      {
        label: '🏨 宿泊',
        items: [
          ['オフィシャルホテル（1泊 / 1室）', '¥35,000']
        ]
      },
      {
        label: '🎢 チケット＋エクスプレスパス',
        items: [
          ['1デイ・スタジオ・パス 大人×2', '¥17,200'],
          ['1デイ・スタジオ・パス 子供×1', '¥5,600'],
          ['エクスプレスパス 大人×2', '¥25,600'],
          ['エクスプレスパス 子供×1', '¥12,800']
        ]
      },
      {
        label: '🍽️ 食事（概算）',
        items: [
          ['パーク内ランチ（3名）', '¥8,000'],
          ['ホテルディナー（3名）', '¥10,000'],
          ['2日目ランチ（道頓堀 3名）', '¥5,000'],
          ['軽食・ドリンク（2日分）', '¥5,000']
        ]
      },
      {
        label: '🎡 観光',
        items: [
          ['海遊館 大人×2', '¥4,800'],
          ['海遊館 子供×1', '¥2,000'],
          ['梅田スカイビル 大人×2', '¥3,000'],
          ['梅田スカイビル 子供×1', '無料']
        ]
      },
      {
        label: '🛍️ その他',
        items: [
          ['パワーアップバンド（子供用）', '¥3,800'],
          ['お土産・雑費', '¥8,000']
        ]
      }
    ],
    subtotal: '¥164,200',
    note: '※ 上記は概算です。実際の料金は変動する場合があります。\n※ スタンダードプランの表示価格「¥219,000」は予備費込みの上限目安です。\n※ エクスプレスパスは全員分（3名）込みです。'
  }
};

function openModal(planType) {
  const data = planData[planType];
  if (!data) return;

  // Parse price string to number
  function parsePrice(p) {
    if (!p || p === '無料' || p === '¥0') return 0;
    return parseInt(p.replace(/[¥,]/g, '')) || 0;
  }

  let html = `<h2 class="modal-title">${data.title}</h2>`;
  html += `<p class="modal-subtitle">${data.subtitle}</p>`;

  data.sections.forEach(section => {
    html += `<span class="modal-section-label">${section.label}</span>`;
    html += '<table class="modal-table"><tbody>';
    section.items.forEach(([name, price]) => {
      const amt = parsePrice(price);
      html += `<tr class="modal-toggle-row" data-amt="${amt}">
        <td>${name}</td>
        <td class="modal-toggle-cell">
          <label class="toggle-switch"><input type="checkbox" checked onchange="recalcModal()"><span class="toggle-slider"></span></label>
        </td>
        <td class="modal-price-cell">${price}</td>
      </tr>`;
    });
    html += '</tbody></table>';
  });

  html += '<table class="modal-table"><tbody>';
  html += `<tr class="subtotal"><td>小計</td><td colspan="2" id="modal-subtotal">${data.subtotal}</td></tr>`;
  html += '</tbody></table>';

  if (data.express) {
    html += `<span class="modal-section-label">${data.express.label}</span>`;
    html += '<table class="modal-table"><tbody>';
    data.express.items.forEach(([name, price]) => {
      const amt = parsePrice(price);
      html += `<tr class="modal-toggle-row modal-ep-row" data-amt="${amt}">
        <td>${name}</td>
        <td class="modal-toggle-cell">
          <label class="toggle-switch"><input type="checkbox" checked onchange="recalcModal()"><span class="toggle-slider"></span></label>
        </td>
        <td class="modal-price-cell">${price}</td>
      </tr>`;
    });
    html += `<tr class="subtotal"><td>EP追加分</td><td colspan="2" id="modal-ep-subtotal">${data.express.subtotal}</td></tr>`;
    html += `<tr class="total-row"><td>EP込み合計</td><td colspan="2" id="modal-ep-total">${data.express.total}</td></tr>`;
    html += '</tbody></table>';
  }

  html += `<div class="modal-note">${data.note.replace(/\\n/g, '<br>')}</div>`;

  document.getElementById('modalBody').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function recalcModal() {
  let mainTotal = 0;
  let epTotal = 0;

  document.querySelectorAll('.modal-toggle-row:not(.modal-ep-row)').forEach(row => {
    const cb = row.querySelector('input[type="checkbox"]');
    const amt = parseInt(row.getAttribute('data-amt')) || 0;
    if (cb && cb.checked) {
      mainTotal += amt;
      row.classList.remove('off');
    } else {
      row.classList.add('off');
    }
  });

  document.querySelectorAll('.modal-toggle-row.modal-ep-row').forEach(row => {
    const cb = row.querySelector('input[type="checkbox"]');
    const amt = parseInt(row.getAttribute('data-amt')) || 0;
    if (cb && cb.checked) {
      epTotal += amt;
      row.classList.remove('off');
    } else {
      row.classList.add('off');
    }
  });

  const subEl = document.getElementById('modal-subtotal');
  if (subEl) subEl.textContent = '¥' + mainTotal.toLocaleString();

  const epSubEl = document.getElementById('modal-ep-subtotal');
  if (epSubEl) epSubEl.textContent = '¥' + epTotal.toLocaleString();

  const epTotalEl = document.getElementById('modal-ep-total');
  if (epTotalEl) epTotalEl.textContent = '¥' + (mainTotal + epTotal).toLocaleString();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ===== Hotel Selection =====
function selectHotel(card) {
  const tier = card.dataset.tier;
  const price = parseInt(card.dataset.price);
  const name = card.dataset.name;

  // Deselect other hotels in same tier
  document.querySelectorAll(`.hotel-card[data-tier="${tier}"]`).forEach(c => {
    c.classList.remove('selected');
  });
  card.classList.add('selected');

  // Update plan card prices based on selected hotel
  if (tier === 'economy') {
    const baseWithoutHotel = 120000 - 10000; // base minus default hotel
    const newTotal = baseWithoutHotel + price;
    const planCard = document.querySelector('.plan-card.economy');
    planCard.querySelector('.plan-price').textContent = '¥' + newTotal.toLocaleString();

    // Update EP total
    const epTotal = newTotal + 25600;
    planCard.querySelector('.express-total strong').textContent = '¥' + epTotal.toLocaleString();
  } else if (tier === 'standard') {
    const baseWithoutHotel = 219000 - 35000; // base minus default hotel
    const newTotal = baseWithoutHotel + price;
    const planCard = document.querySelector('.plan-card.standard');
    planCard.querySelector('.plan-price').textContent = '¥' + newTotal.toLocaleString();
  }
}

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ===== Budget Toggle =====
function recalcBudget() {
  let total = 0;
  document.querySelectorAll('#budget-list .budget-row[data-amount]').forEach(row => {
    const cb = row.querySelector('input[type="checkbox"]');
    const amount = parseInt(row.getAttribute('data-amount')) || 0;
    if (cb && cb.checked) {
      total += amount;
      row.classList.remove('off');
    } else {
      row.classList.add('off');
    }
  });
  const formatted = '¥' + total.toLocaleString();
  const calcEl = document.getElementById('budget-calc-total');
  if (calcEl) calcEl.textContent = formatted;
  const topEl = document.getElementById('budget-total');
  if (topEl) topEl.textContent = formatted;
}

// ===== Checklist =====
function initChecklist() {
  document.querySelectorAll('.check-item input[type="checkbox"]').forEach(cb => {
    const key = cb.getAttribute('data-key');
    if (key && localStorage.getItem(key) === 'true') {
      cb.checked = true;
    }
    cb.addEventListener('change', () => {
      if (key) localStorage.setItem(key, cb.checked);
    });
  });
}

function resetChecklist() {
  document.querySelectorAll('.check-item input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
    const key = cb.getAttribute('data-key');
    if (key) localStorage.removeItem(key);
  });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  injectAnimationStyles();
  initScrollAnimations();
  initTouchFeedback();
  initHeroParallax();
  initPlanButtons();
  initChecklist();
  recalcBudget();
});

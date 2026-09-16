// กีฬาสีเชื่อมความสามัคคี 3 หน่วยงาน 2026 - Interactive Form Controller

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  
  // Input References
  const fullNameInput = document.getElementById('fullName');
  const fullNameError = document.getElementById('fullNameError');

  const universityEmailInput = document.getElementById('universityEmail');
  const universityEmailError = document.getElementById('universityEmailError');

  const athleteRadios = document.querySelectorAll('input[name="isAthlete"]');
  const athleteDetailBox = document.getElementById('athleteDetailBox');
  const athleteSportDetailInput = document.getElementById('athleteSportDetail');
  const athleteSportDetailError = document.getElementById('athleteSportDetailError');

  const competitionRadios = document.querySelectorAll('input[name="joinCompetition"]');
  const sportSelectionBox = document.getElementById('sportSelectionBox');
  const sportCheckboxes = document.querySelectorAll('input[name="sports"]');
  const sportsError = document.getElementById('sportsError');

  const otherSportCheck = document.getElementById('otherSportCheck');
  const otherSportDetailBox = document.getElementById('otherSportDetailBox');
  const otherSportDetailInput = document.getElementById('otherSportDetail');
  const otherSportDetailError = document.getElementById('otherSportDetailError');

  // Modal References
  const successModal = document.getElementById('successModal');
  const modalRegId = document.getElementById('modalRegId');
  const summaryDetails = document.getElementById('summaryDetails');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // Google Apps Script Web App Endpoint
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXKDQbrWRbQNAIV1if2lB2qQUKwgPFntf2BkRDwczVcdIqqt0pReCiezB2jn6yzc38/exec';
  const submitBtn = document.getElementById('submitBtn');

  // Respondent Counter Elements
  const totalRespondentsCount = document.getElementById('totalRespondentsCount');
  const bottomRespondentsCount = document.getElementById('bottomRespondentsCount');
  const STORAGE_KEY = 'oou_sport_2026_registrations_v2';
  
  // ล้างแคชเก่าที่ตกค้างจากการทดสอบ
  try {
    localStorage.removeItem('oou_sport_2026_registrations');
  } catch (e) {}

  // 1. จัดการสถานะเป็นนักกีฬามหาวิทยาลัย (เป็น / ไม่เป็น)
  athleteRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'yes') {
        athleteDetailBox.classList.remove('hidden');
        athleteDetailBox.style.display = 'block';
        setTimeout(() => athleteSportDetailInput.focus(), 150);
      } else {
        athleteDetailBox.classList.add('hidden');
        athleteDetailBox.style.display = 'none';
        athleteSportDetailInput.value = '';
        clearError(athleteSportDetailInput, athleteSportDetailError);
      }
    });
  });

  // 2. จัดการตัวเลือกความสนใจแข่งขัน (มีให้เลือก / สนใจเป็นกองเชียร์)
  // หากเลือก "สนใจเป็นกองเชียร์" -> พื้นที่ด้านล่างจะว่างเปล่าทันที
  competitionRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'interested') {
        sportSelectionBox.classList.remove('hidden');
        sportSelectionBox.style.display = 'block';
      } else {
        sportSelectionBox.classList.add('hidden');
        sportSelectionBox.style.display = 'none';
        
        // ล้างค่าที่เลือกไว้ทั้งหมด
        sportCheckboxes.forEach(cb => cb.checked = false);
        otherSportDetailBox.classList.add('hidden');
        otherSportDetailBox.style.display = 'none';
        otherSportDetailInput.value = '';
        sportsError.style.display = 'none';
        clearError(otherSportDetailInput, otherSportDetailError);
      }
    });
  });

  // 3. จัดการกรณีเลือกกีฬาอื่นๆ
  if (otherSportCheck) {
    otherSportCheck.addEventListener('change', () => {
      if (otherSportCheck.checked) {
        otherSportDetailBox.classList.remove('hidden');
        otherSportDetailBox.style.display = 'block';
        setTimeout(() => otherSportDetailInput.focus(), 150);
      } else {
        otherSportDetailBox.classList.add('hidden');
        otherSportDetailBox.style.display = 'none';
        otherSportDetailInput.value = '';
        clearError(otherSportDetailInput, otherSportDetailError);
      }
    });
  }

  // 4. Clear Error ทันทีเมื่อผู้ใช้เริ่มพิมพ์
  fullNameInput.addEventListener('input', () => clearError(fullNameInput, fullNameError));
  universityEmailInput.addEventListener('input', () => clearError(universityEmailInput, universityEmailError));
  athleteSportDetailInput.addEventListener('input', () => clearError(athleteSportDetailInput, athleteSportDetailError));
  otherSportDetailInput.addEventListener('input', () => clearError(otherSportDetailInput, otherSportDetailError));

  sportCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (getSelectedSports().length > 0) {
        sportsError.style.display = 'none';
      }
    });
  });

  function clearError(inputElem, errorElem) {
    if (inputElem) {
      inputElem.closest('.form-group, .expandable-panel')?.classList.remove('has-error');
    }
    if (errorElem) {
      errorElem.style.display = 'none';
    }
  }

  function showError(inputElem, errorElem, message) {
    if (inputElem) {
      inputElem.closest('.form-group, .expandable-panel')?.classList.add('has-error');
    }
    if (errorElem) {
      if (message) errorElem.textContent = message;
      errorElem.style.display = 'block';
    }
  }

  function getSelectedSports() {
    const selected = [];
    sportCheckboxes.forEach(cb => {
      if (cb.checked) {
        if (cb.value === 'other') {
          const detail = otherSportDetailInput.value.trim();
          selected.push(detail ? `อื่นๆ: ${detail}` : 'กีฬาอื่นๆ');
        } else {
          selected.push(cb.value);
        }
      }
    });
    return selected;
  }

  function isValidEmail(email) {
    // ต้องลงท้ายด้วย @cmu.ac.th เท่านั้น (Case-insensitive)
    return /^[^\s@]+@cmu\.ac\.th$/i.test(email.trim());
  }

  // 5. Submit Event
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // ตรวจสอบชื่อ-นามสกุล
    const fullNameVal = fullNameInput.value.trim();
    if (!fullNameVal) {
      showError(fullNameInput, fullNameError, 'กรุณากรอกชื่อ-นามสกุล');
      isValid = false;
    } else {
      clearError(fullNameInput, fullNameError);
    }

    // ตรวจสอบอีเมล ต้องเป็น @cmu.ac.th เท่านั้น และห้ามซ้ำ
    const emailVal = universityEmailInput.value.trim().toLowerCase();
    if (!emailVal) {
      showError(universityEmailInput, universityEmailError, 'กรุณากรอก E-mail มหาวิทยาลัย');
      isValid = false;
    } else if (!isValidEmail(emailVal)) {
      showError(universityEmailInput, universityEmailError, 'กรุณาใช้อีเมลมหาวิทยาลัยที่ลงท้ายด้วย @cmu.ac.th เท่านั้น');
      isValid = false;
    } else if (isEmailAlreadyRegistered(emailVal)) {
      showError(universityEmailInput, universityEmailError, '⚠️ อีเมลนี้ลงทะเบียนเรียบร้อยแล้ว ไม่สามารถลงทะเบียนซ้ำได้');
      isValid = false;
    } else {
      clearError(universityEmailInput, universityEmailError);
    }

    // ตรวจสอบสถานะนักกีฬา
    const isAthleteVal = document.querySelector('input[name="isAthlete"]:checked')?.value;
    let athleteSportDesc = '';
    if (isAthleteVal === 'yes') {
      athleteSportDesc = athleteSportDetailInput.value.trim();
      if (!athleteSportDesc) {
        // เปิดกล่องให้เห็นหากยังซ่อนอยู่
        athleteDetailBox.classList.remove('hidden');
        athleteDetailBox.style.display = 'block';
        showError(athleteSportDetailInput, athleteSportDetailError, 'กรุณาระบุชนิดกีฬาที่เป็นตัวแทนมหาวิทยาลัย');
        isValid = false;
      } else {
        clearError(athleteSportDetailInput, athleteSportDetailError);
      }
    }

    // ตรวจสอบความสนใจแข่งขัน
    const joinCompVal = document.querySelector('input[name="joinCompetition"]:checked')?.value;
    let selectedSports = [];
    if (joinCompVal === 'interested') {
      if (otherSportCheck && otherSportCheck.checked) {
        const otherVal = otherSportDetailInput.value.trim();
        if (!otherVal) {
          showError(otherSportDetailInput, otherSportDetailError, 'กรุณาระบุชนิดกีฬาอื่นๆ');
          isValid = false;
        } else {
          clearError(otherSportDetailInput, otherSportDetailError);
        }
      }

      selectedSports = getSelectedSports();
      if (selectedSports.length === 0) {
        sportsError.style.display = 'block';
        isValid = false;
      } else {
        sportsError.style.display = 'none';
      }
    }

    if (!isValid) {
      const firstError = document.querySelector('.has-error, .validation-msg[style*="block"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // สุ่มเลขเด็ด 4 หลัก (0000 - 9999 หรือ 1000 - 9999)
    const random4Digits = String(Math.floor(1000 + Math.random() * 9000));
    const newRecord = {
      id: `LUCKY-${random4Digits}`,
      fullName: fullNameVal,
      email: emailVal,
      isAthlete: isAthleteVal === 'yes',
      athleteDetail: isAthleteVal === 'yes' ? athleteSportDesc : '',
      joinCompetition: joinCompVal === 'interested',
      sports: joinCompVal === 'interested' ? selectedSports : ['สนใจเป็นกองเชียร์'],
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' ' +
                 new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    // 1. แสดงสถานะตอบรับแบบทันที (Optimistic Response)
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="btn-text">กำลังออกบัตร...</span>
      <div class="spinner" style="width:18px;height:18px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;"></div>
    `;

    // 2. บันทึกลง Local Cache และเปิดบัตรผู้เข้าร่วมงานทันทีโดยไม่ต้องรอ Google Apps Script (ลดเวลารอจาก 3-5 วิ เหลือ 0.2 วิ)
    saveRecord(newRecord);

    // ปรับตัวเลขนับจำนวนขึ้นแบบ Optimistic ล่วงหน้าทันที
    if (totalRespondentsCount) {
      const current = parseInt(totalRespondentsCount.textContent) || 0;
      totalRespondentsCount.textContent = current + 1;
    }
    if (bottomRespondentsCount) {
      const currentBottom = parseInt(bottomRespondentsCount.textContent) || 0;
      bottomRespondentsCount.textContent = currentBottom + 1;
    }

    // เตรียม Payload สำหรับส่งไป Google Apps Script
    const payload = new URLSearchParams();
    payload.append('id', newRecord.id);
    payload.append('timestamp', newRecord.timestamp);
    payload.append('fullName', newRecord.fullName);
    payload.append('email', newRecord.email);
    payload.append('isAthlete', newRecord.isAthlete ? 'เป็น' : 'ไม่เป็น');
    payload.append('athleteDetail', newRecord.athleteDetail || '-');
    payload.append('joinCompetition', newRecord.joinCompetition ? 'มีให้เลือก' : 'สนใจเป็นกองเชียร์');
    payload.append('sports', newRecord.sports.join(', '));

    // ส่งข้อมูลไป Google Apps Script เบื้องหลัง (Background Transmission)
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload.toString()
    })
    .then(() => {
      console.log('Background sync to Google Sheets completed.');
      // ดึงค่ายืนยันล่าสุดจาก Google Sheets มาซิงก์อีกครั้ง
      fetchSheetCount();
    })
    .catch((err) => {
      console.warn('Background sync note:', err);
    });

    // 3. แสดงผลบัตรทันทีภายใน 250ms เพื่อ UX ที่ลื่นไหลและรวดเร็ว
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;

      // แสดงบัตรลงทะเบียน
      showSuccessTicket(newRecord);

      // รีเซ็ตฟอร์ม
      form.reset();
      athleteDetailBox.classList.add('hidden');
      athleteDetailBox.style.display = 'none';
      sportSelectionBox.classList.remove('hidden');
      sportSelectionBox.style.display = 'block';
      otherSportDetailBox.classList.add('hidden');
      otherSportDetailBox.style.display = 'none';
    }, 250);
  });

  // ฟังก์ชันดึงจำนวนผู้ลงทะเบียนจริงจาก Google Sheets
  function fetchSheetCount() {
    fetch(GOOGLE_SCRIPT_URL)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count !== 'undefined') {
          const sheetCount = Number(data.count);
          if (totalRespondentsCount) totalRespondentsCount.textContent = sheetCount;
          if (bottomRespondentsCount) bottomRespondentsCount.textContent = sheetCount;

          // หากข้อมูลใน Google Sheets ถูกล้างจนเหลือ 0 (เช่น แอดมินลบแถวทดสอบ)
          // ให้เคลียร์ local cache ในเบราว์เซอร์ออกด้วย เพื่อไม่ให้ติดเตือน "อีเมลซ้ำ"
          if (sheetCount === 0) {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      })
      .catch(() => {
        const count = getRecords().length;
        if (totalRespondentsCount) totalRespondentsCount.textContent = count;
        if (bottomRespondentsCount) bottomRespondentsCount.textContent = count;
      });
  }

  // Storage Handlers (Local Cache)
  function getRecords() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // ตรวจสอบว่ามีอีเมลนี้ลงทะเบียนไปแล้วหรือไม่
  function isEmailAlreadyRegistered(email) {
    if (!email) return false;
    const records = getRecords();
    const cleanEmail = email.trim().toLowerCase();
    return records.some(r => r.email && r.email.trim().toLowerCase() === cleanEmail);
  }

  function saveRecord(record) {
    const list = getRecords();
    list.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function updateCounter() {
    fetchSheetCount();
  }

  // โหลดจำนวนผู้ตอบเริ่มต้นจาก Google Sheet จริง
  fetchSheetCount();

  // ฟังก์ชันป้องกัน XSS Injection ก่อนแสดงผล
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // แสดงผล Modal บัตรเข้าร่วม
  function showSuccessTicket(item) {
    modalRegId.textContent = escapeHtml(item.id);
    summaryDetails.innerHTML = `
      <div class="summary-item">
        <span class="label">ผู้ลงทะเบียน:</span>
        <span class="val">${escapeHtml(item.fullName)}</span>
      </div>
      <div class="summary-item">
        <span class="label">อีเมล:</span>
        <span class="val">${escapeHtml(item.email)}</span>
      </div>
      <div class="summary-item">
        <span class="label">สถานะตัวแทน:</span>
        <span class="val">${item.isAthlete ? `เป็น (${escapeHtml(item.athleteDetail)})` : 'ไม่เป็น'}</span>
      </div>
      <div class="summary-item">
        <span class="label">การมีส่วนร่วม:</span>
        <span class="val" style="color: var(--royal-blue);">${escapeHtml(item.sports.join(', '))}</span>
      </div>
      <div class="summary-item">
        <span class="label">วัน-เวลาที่ลง:</span>
        <span class="val" style="font-size: 0.8rem; color: var(--slate-400);">${escapeHtml(item.timestamp)}</span>
      </div>
    `;
    successModal.classList.remove('hidden');
  }

  closeModalBtn.addEventListener('click', () => {
    successModal.classList.add('hidden');
  });

  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.add('hidden');
    }
  });
});

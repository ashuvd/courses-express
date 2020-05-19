const toCurrency = price => {
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency'
  }).format(price);
};

const toDate = date => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date));
};

document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent);
});

M.Tabs.init(document.querySelectorAll('.tabs'));
M.Collapsible.init(document.querySelectorAll('.collapsible'));
M.updateTextFields();

const formLesson = document.getElementById('form-lesson');
if (formLesson) {
  const btnFile = formLesson.querySelector('.btn_file');
  const btnLink = formLesson.querySelector('.btn_link');
  const filesContainer = formLesson.querySelector('.files');
  const linksContainer = formLesson.querySelector('.links');
  let countFiles = 1;
  let countLinks = 1;
  btnFile.addEventListener('click', () => {
    const html = `
      <li>
        <div class="file-field input-field">
          <div class="btn">
            <span>Дополнительный файл</span>
            <input type="file" name="dopFile${countFiles}">
          </div>
          <div class="file-path-wrapper">
            <input class="file-path validate" type="text">
          </div>
        </div>
      </li>
    `;
    countFiles++;
    filesContainer.innerHTML += html;
  });
  btnLink.addEventListener('click', () => {
    const html = `
      <li>
        <div class="input-field">
          <input id="dopLink${countLinks}" class="validate" name="dopLink${countLinks}" type="text" required />
          <label for="dopLink${countLinks}">Ссылка на дополнительный материал</label> 
          <span class="helper-text" data-error="Введите URL"></span>
        </div>
      </li>
    `;
    countLinks++;
    linksContainer.innerHTML += html;
  });
}

const icons = document.querySelectorAll('.material-icons');
icons.forEach(i => i.addEventListener('click', e => {
  e.stopPropagation();
}))

// const forms = document.querySelectorAll('.form-bearer');
// forms.forEach(f => f.addEventListener('submit', e => {
//   console.log(e);
// }))

// const logoutLink = document.getElementById('logout');
// if (logoutLink) {
//   logoutLink.onclick = () => {
//     localStorage.removeItem('token');
//   }
// }

// const formLogin = document.getElementById('form-login');
// if (formLogin) {
//   formLogin.addEventListener('submit', async (e) => {
//     try {
//       e.preventDefault();
//       const email = e.target.elements.email.value;
//       const password = e.target.elements.password.value;
//       const csrf = e.target.elements._csrf.value;
//       const response = await fetch('/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//           // 'Content-Type': 'application/x-www-form-urlencoded'
//           // 'X-XSRF-TOKEN': csrf
//         },
//         body: JSON.stringify({_csrf: csrf, email, password})
//       })
//       const {token} = await response.json();
//       localStorage.setItem('token', token);
//       window.location.href = "/";
//     } catch (error) {
//       console.log(error)
//       alert(error)
//     }
//   })
// }
const formComment = document.querySelector('.form-comment');
if (formComment) {
  formComment.addEventListener('submit', async (e) => {
    try {
      e.preventDefault();
      const message = e.target.elements.message.value;
      const userId = e.target.elements.userId.value;
      const lessonId = e.target.elements.lessonId.value;
      const csrf = e.target.elements._csrf.value;
      const response = await fetch('/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded'
          // 'X-XSRF-TOKEN': csrf
        },
        body: JSON.stringify({_csrf: csrf, message, userId, lessonId})
      })
      const comment = await response.json();
      const html = `
      <div class="user">
        <span class="user__name">Пользователь: ${comment.user.login},</span>
        <span class="user__date">дата: ${toDate(comment.date)}</span>
      </div>
      <div class="message">${comment.message}</div>
    `
      const li = document.createElement('li');
      li.className = 'list__item';
      li.innerHTML = html;
      document.querySelector('.list').appendChild(li);
      e.target.elements.message.value = '';
    } catch (error) {
      console.log(error)
      alert(error)
    }
  })
}


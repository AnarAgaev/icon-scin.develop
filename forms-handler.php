<?php session_start();
function normalizePhone($str) {
    $arr = str_split($str);

    return '+'
        . $arr[0]
        . ' ('
        . $arr[1] . $arr[2] . $arr[3]
        . ') '
        . $arr[4] . $arr[5] . $arr[6]
        . '-'
        . $arr[7] . $arr[8]
        . '-'
        . $arr[9] . $arr[10];
}

if (isset($_POST['form'])) {
  
  $message = '
    <html>
    <head>
      <title>Сообщение пользователя с сайта Квиз лендинга.</title>
    </head>
    <body>
      <h2>Сообщение пользователя с сайта Квиз лендинга.</h2>
      <table cellspacing="0" cellpadding="0" style="background-color: #f3f3f3; padding: 15px 15px 20px 15px">';      
      
  switch ($_POST['form']) {
    case 'callback':        
        $message .= '<thead><tr><td colspan="2" style="font-weight: bold; padding-bottom: 10px; font-size: 1.2em;">Пользователь заполнил форму быстрая консультация.</td></tr></thead>';
        $message .= '<tbody>';
        $message .= '<tr><td colspan="2" style="padding-bottom: 10px">Данные внесенные пользователем:</td></tr>';
        $message .= '<tr style="background: white;"><td style="padding: 7px 10px 0px;">Пользователь указал телефон:</td><td>' . $_POST['phone'] . '</td></tr>';
        $message .= '<tr style="background: white;"><td style="padding: 0 10px 7px;">Удобное вермя для контакта:</td><td>' . $_POST['time'] . '</td></tr>';
        $message .= '</tbody>';
        break;

    case 'subscribe':
        $message .= '<thead><tr><td colspan="2" style="font-weight: bold; padding-bottom: 10px; font-size: 1.2em;">Пользователь указал адрес электронной почты.</td></tr></thead>';
        $message .= '<tbody>';
        $message .= '<tr><td colspan="2" style="padding-bottom: 10px">Данные внесенные пользователем:</td></tr>';
        $message .= '<tr style="background: white;"><td style="padding: 7px 10px;">Адрес электронной почты:</td><td>' . $_POST['email'] . '</td></tr>';
        $message .= '</tbody>';
        break;
    }
  $message .= '
      </table>
      <br>
      <p>
        <strong>Не отвечайте на это сообщение через онлайн почту или в вашем почтовом клиенте.</strong>
        <br>
        Cообщение сгенерировано автоматически.
        <br>
        Для контакта с посетителем сайта, используйте данные указанные выше.
      </p>
    </body>
    </html>';

    $to      = 'quiz24-job@yandex.ru';
    $subject = 'Сообщение пользователя сайта Квиз лендинга.';
    
    $headers[] = 'MIME-Version: 1.0';
    $headers[] = 'Content-type: text/html; charset=iso-8859-1';
    $headers[] = 'To: Managers <' . $to . '>,';
    $headers[] = 'From: Quiz24.ru <example@quiz24.ru>';
    
    /* Cc: (копия, carbon copy) — вторичные получатели письма, которым направляется копия. Они видят и знают о наличии друг друга.
     * Bcc: (скрытая копия, blind carbon copy) — скрытые получатели письма, чьи адреса не показываются другим получателям.
     * $headers[] = 'Cc: birthdayarchive@example.com';
     * $headers[] = 'Bcc: birthdaycheck@example.com'; 
     */

    $arResponse['error'] = mail($to, $subject, $message, implode("\r\n", $headers));
    $arResponse['post'] = $_POST;

    $JSON__DATA = defined('JSON_UNESCAPED_UNICODE')
        ? json_encode($arResponse, JSON_UNESCAPED_UNICODE)
        : json_encode($arResponse);
    echo $JSON__DATA;
}
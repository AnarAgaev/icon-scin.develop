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

    $message = 'Сообщение пользователя с сайта Квиз лендинга.' . "\r\n";

    switch ($_POST['form']) {
        case 'callback':
            $message .= "Пользователь заполнил форму быстрая консультация. " . "\r\n\n";
            $message .= "Данные внесенные пользователем: " . "\r\n";
            $message .= "Удобное вермя для контакта: " . $_POST['time'] . "\r\n";
            $message .= "Пользователь указал телефон: " . $_POST['phone'] . "\r\n";
            break;

        case 'subscribe':
            $message .= "Пользователь указал адрес электронной почты." . "\r\n\n";
            $message .= "Данные внесенные пользователем: " . "\r\n";
            $message .= "Email: " . $_POST['email'] . "\r\n";
            break;
    }

    $message .= "\r\n\n" . '*******' . "\r\n";
    $message .= "Не отвечайте на это сообщение через онлайн почту или в вашем почтовом клиенте." . "\r\n";
    $message .= "Cообщение сгенерировано автоматически." . "\r\n";
    $message .= "Для контакта с посетителем сайта, используйте данные указанные выше." . "\r\n";

    $to      = 'anar.n.agaev@gmail.com';
    $subject = 'Сообщение пользователя сайта Квиз лендинга.';
    $headers = 'From: webmaster@example.com' . "\r\n" .
    'Reply-To: webmaster@example.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

    $arResponse['error'] = mail($to, $subject, $message, $headers);
    $arResponse['post'] = $_POST;

    $JSON__DATA = defined('JSON_UNESCAPED_UNICODE')
        ? json_encode($arResponse, JSON_UNESCAPED_UNICODE)
        : json_encode($arResponse);
    echo $JSON__DATA;
}
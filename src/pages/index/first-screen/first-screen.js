$(document).ready(() => {
    let comparison = document
        .getElementById('comparison');

    let cocoenNode;

    function initialCocoen () {
        if (!$('#comparison')[0]) {
            createComparison();
        }

        setTimeout(buildCocoen, 100);
    }

    function createComparison () {
        let target = document.getElementById('comparisonWrap'),
            body = document.createElement('span'),
            before = document.createElement('img'),
            after = document.createElement('img');

        body.id = 'comparison';
        before.classList.add('first-screen__comparison-pic');
        before.src = 'img/comparison-before.jpg';
        after.classList.add('first-screen__comparison-pic');
        after.src = 'img/comparison-after.jpg';

        body.appendChild(before);
        body.appendChild(after);
        target.appendChild(body);

        comparison = body;
    }

    function buildCocoen () {
        cocoenNode = Cocoen.create( comparison, {
            start: '53',
            color: '#ffffff'
        });
    }

    function removeCocoen () {
        if (cocoenNode) {
            cocoenNode.remove();
        }
    }

    $(window).resize(e => {
        $(window).width() > 1140
            ? initialCocoen()
            : removeCocoen();
    });

    // Инициализируем картинку до/после на первом экране
    if ($(window).width() > 1140) {
        initialCocoen();
    }
});
var new_svg_wrap = document.createElement('div');
    new_svg_wrap.classList.add('scaling-svg-container')
    new_svg_wrap.style = 'padding-bottom:60%';

document.querySelector('#start').addEventListener('click', function(e){

    var btn = document.querySelector('#start');
    var input = document.querySelector('#input');
    var svg_before = document.querySelector('#svg_before');
    var svg_after = document.querySelector('#svg_after');

    //содание DOM элементов из инпутов
        var input_svg_after = document.createElement('div')
        var input_svg_before = document.createElement('div')

        input_svg_after.innerHTML = svg_after.value;
        input_svg_before.innerHTML = svg_before.value;

        input_svg_after = input_svg_after.querySelector('svg')
        input_svg_before = input_svg_before.querySelector('svg')

    //создание нового DOM svg
        var new_svg = document.createElement('svg')
        
        new_svg.classList.add('scaling-svg')
        new_svg.setAttribute("viewBox", input_svg_after.getAttribute('viewbox') || input_svg_after.getAttribute('viewBox'))
        new_svg.setAttribute('xmlns', input_svg_after.getAttribute('xmlns'))

    // группы и тултипы из after
        var input_svg_after_groups = input_svg_after.querySelectorAll('svg > g > g[id^=s]')
        var input_svg_after_tooltips = input_svg_after.querySelectorAll('g[id^="Tooltip"]')

    // points из after (иконки лесниц, лифтов и тд, вся группа)
        var input_svg_after_points = input_svg_after.querySelector('g#Points')

    // формируем новые группы (ссылки) из внутренностей after и ссылок before
        input_svg_after_groups.forEach(function(g){
            var id = g.getAttribute('id');
            var new_a = document.createElement('a');
            var old_a = (input_svg_before) ? input_svg_before.querySelector('a#'+id) : false
            
            new_a.setAttribute('id', id);
            if(old_a){
                new_a.setAttribute('href', old_a.getAttribute('href'));
            } else{
                new_a.setAttribute('href', '#');
            }
            new_a.innerHTML = g.innerHTML;
            new_svg.append(new_a)
        })

    // добавляем points из after
        new_svg.append(input_svg_after_points)

    // исправляем тултипы из after и добавляем 
        input_svg_after_tooltips.forEach(function(tooltip){
            // исправляем
                var rx = tooltip.querySelector('[rx]');
                rx.setAttribute('rx', '195')
                rx.setAttribute('ry', '195')
            // добавляем
            new_svg.append(tooltip);
        })
    

    // добавляем в обертку
        //создание обертки
        new_svg_wrap.append(new_svg)

        // исправляем viewBox в финальном элементе
        var fix = new_svg_wrap.innerHTML
        fix = fix.replace('viewbox', 'viewBox')
        new_svg_wrap.innerHTML = fix

        document.querySelector('#output').value = new_svg_wrap.outerHTML

    // выводим все ссылки
        var table = document.querySelector('#groups_table');
        var new_svg_groups = new_svg_wrap.querySelectorAll('a')
        var new_svg_wrap_tooltips = new_svg_wrap.querySelectorAll('g[id^="Tooltip"]')

        new_svg_groups.forEach(function(a){
            var tr = document.createElement('tr');
                tr.innerHTML = '<td class="id"></td><td class="link" contenteditable="true"></td><td class="text"></td>';
            var td_id = tr.querySelector('.id')
            var td_link = tr.querySelector('.link')
            var td_text = tr.querySelector('.text')

            td_id.innerHTML = a.getAttribute('id')
            td_link.innerHTML = a.getAttribute('href')

            var isDefault = a.getAttribute('id').includes()                     //<a id="s1-2"> <g id="Tooltip1-1">
            var isSmall = a.getAttribute('id').toLowerCase().includes('small')  //<a id="small1-1"> <g id="TooltipSmall1-1">
            var isEx = a.getAttribute('id').toLowerCase().includes('ex')        //<a id="s-ex1-2"> <g id="TooltipS-ex1-1">

            var selector

            if(isSmall){
                selector = '#Tooltip'+a.getAttribute('id').replace('s', 'S')
            } else if(isEx){
                selector = '#Tooltip'+a.getAttribute('id')
            } else {
                selector = '#Tooltip'+a.getAttribute('id').substr(1)
            }

            var tooltip = new_svg_wrap.querySelector(selector)
            var tooltip_text
            if(tooltip){
                tooltip_text = (tooltip.querySelector('[font-family]')) ? tooltip.querySelector('[font-family]').textContent : 'Тултип не найден !'
            } else{
                tooltip_text = '<span style="color:red">Тултип не найден !</span>'
            }

            td_text.innerHTML = tooltip_text
            

            table.append(tr)

            td_link.addEventListener('input', function(e){
                new_svg_wrap.querySelector('a#'+td_id.textContent).setAttribute('href', td_link.textContent)
                document.querySelector('#output').value = new_svg_wrap.outerHTML
            })
        })
        table.style.display = 'table'

})

document.querySelector('#links_generate').addEventListener('click', function(e){
    var links = document.querySelector('#links')
    var groups_table = document.querySelector('#groups_table')
    var trs = groups_table.querySelectorAll('tr')

    trs.forEach(function(tr){
        var td_id = tr.querySelector('.id').textContent
        var td_text = tr.querySelector('.text').textContent
        var link = ''
        if(td_text !== 'Тултип не найден !')  link = '<p id="'+td_id+'">'+td_text+'</p>\n';
        
        links.value += link
    })

    links.style.display = ''
})



























/*

document.querySelector("#btn").onclick = function(){
    let one = document.querySelector('section#one');
    let two = document.querySelector('section#two');
    let ps = document.querySelector('#ps');

    ps.innerHTML = '';
    one.innerHTML = document.querySelector('textarea#one').value;
    two.innerHTML = document.querySelector('textarea#two').value;

    for(let element of two.querySelectorAll('[ry="195.02"]')){
        let ry = element.getAttribute('ry');

        if(element.getAttribute('rx')){
            element.setAttribute('rx', ry)
        }
    }

    for(let g of two.querySelectorAll('svg > g')){
        let isPoints = g.getAttribute('id') == 'Points';

        if(isPoints) break;

        let content = g.innerHTML;
        let id = g.getAttribute('id');

        g.insertAdjacentHTML('afterend','<a href="#" id="'+id+'">'+content+'</a>');
        g.remove();

    }


    console.log(
        'Tooltips', 
        one.querySelectorAll('g[id*="Tooltip"]').length,
        two.querySelectorAll('g[id*="Tooltip"]').length
    );
    console.log(
        'a', 
        one.querySelectorAll('a').length,
        two.querySelectorAll('a').length
    );

    for(let a of one.querySelectorAll('a')){
        let id = a.getAttribute('id');
        let href = a.getAttribute('href');

        if(!two.querySelector('a#' + id)){
            console.log(two.querySelector('a#' + id), id, href);
        }else{
            two.querySelector('a#' + id).setAttribute('href', href);
        }
    }

    let html = '';
    for(let a of two.querySelectorAll('a')){
        let id = a.getAttribute('id');
        let href = a.getAttribute('href');

        html += '<p id="'+id+'">'+href+'</p>\n';
    }
    ps.innerHTML = html;

    document.querySelector('textarea#two').value = document.querySelector('section#two').innerHTML;
}
*/
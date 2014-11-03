template
========

jQuery插件形式的前端模板，从underscore中解出。

##安装

因为改造成了jQuery插件，所以依赖jQuery。

```html
<script type="text/javascript" src="yourpath/jquery.js"></script>
<script type="text/javascript" src="yourpath/jquery.template.js"></script>
```

##使用

与underscore.js模板使用相同，接口一致。

```html
<script type="text/cy-template" id='template'>
    <ul class='unstyled-list'>
        <%$.each(users, function(i, user) {%>
            <li data-index=<%- i %>>Name is <%= user.name %>, Gender is <%= user.gender %>.</li>
        <% });%>
    </ul>
</script>
<script type="text/javascript">
        var template = $('#template').text();
        var users = [{
            name: 'Jerry',
            gender: 'male'
        },{
            name: 'Kate',
            gender: 'female'
        },{
            name: 'Lucy',
            gender: 'female'
        }];
        var html = $.template(template, users);
        $('#container').html(html);
</script>
```

更详细的可以看测试文件。
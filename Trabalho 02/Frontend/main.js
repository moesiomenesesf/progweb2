$( document ).ready(function(){
    $.ajax({
        contentType: 'application/json',
            cache: false,
            method: 'GET',
            url: 'http://localhost:3000/usuarios' ,
            success: function(data){
                console.log(data);
            }
    });
    listar();
    adicionar();
})

function listar(){
    $('#listar').click(function(){
        $("#table").empty();
        $("#table").append(`<tr><td> Nome </td> <td> Login</td></tr>`)
        $.ajax({
            contentType: 'application/json',
            cache: false,
            method: 'GET',
            url: 'http://localhost:3000/usuarios' ,
            success: function(data){
                data.forEach(element => {
                    $("#table").append(`<tr><td class="id">${element["id"]}</td><td class="nome"> ${element["nome"]}</td> <td class="login"> ${element["login"]}</td>
                    <td><button class="editar">EDITAR</button></td>
                    <td><button class="excluir">EXCLUIR</button></td></tr>`)
                });
    
            }
    
        })

        $(document).ajaxComplete(function(){
            $('.editar').click(function(){
                let id = $(this).parent().parent().children(".id").html();
                let nome = $(this).parent().parent().children(".nome").html();
                let login = $(this).parent().parent().children(".login").html();
                $("#formAddEdit").empty();
                $("#formAddEdit").attr("action", `http://localhost:3000/usuarios/${id}`);
                $("#formAddEdit").attr("method", `patch`);
                $("#formAddEdit").append(`<fieldset><legend>Edição de Usuário</legend>Nome:<input class="formNome" type='text' name='nome' value='${nome}'></input> Login:<input class="formLogin" type='text' name='login' value='${login}'></input> Senha:<input class="pass" type='password' name='senha'></input> <button id="submit"></button> </fieldset>`)
                $("#submit").click(function(){
                    let nome = $(".formNome").val();
                    let login = $(".formLogin").val();
                    let password = $(".pass").val();
                    console.log(`UPDATE usuario SET nome='${nome}', login='${login}', senha='${password}' WHERE ID=${id}`);
                    console.log('http://localhost:3000/usuarios/'+id+`?nome=${nome}&login=${login}&senha=${password}`);
                    $.ajax({
                        contentType: 'application/json',
                        cache: false,
                        method: 'PATCH',
                        url: 'http://localhost:3000/usuarios/'+id+`?nome=${nome}&login=${login}&senha=${password}`,
                        success: function(data){
                            window.location.href = "http://localhost:3000/usuarios/"; 
                        }
                    })
                })
            })
            $('.excluir').click(function(){
                let id = $(this).parent().parent().children(".id").html()
                $.ajax({
                    contentType: 'application/json',
                    cache: false,
                    method: 'DELETE',
                    url: 'http://localhost:3000/usuarios/'+id,
                    success: function(data){
                        window.location.href = "http://localhost:3000/usuarios/"; 
                    }
            
                })
                listar();
            })
        })

        
    })
}

function adicionar(){
    $('#adicionar').click(function(){
        $("#formAddEdit").empty();
        $("#formAddEdit").append("<fieldset><legend>Cadastro de Usuário</legend>Nome:<input type='text' name='nome'></input> Login:<input type='text' name='login'></input> Senha:<input type='password' name='senha'></input> <input type='submit'></input> </fieldset>")
    })
}

function mostrarDropbox(){
    $.ajax({
        contentType: 'application/json',
        cache: false,
        method: 'POST',
        url: 'http://localhost:3000/Arquivos',
        success: function(data){
            var data = data;
        }
    });
    console.log(data);
    //$('#arquivos>ul').append("<li></li>")
};

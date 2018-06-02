import { Component, OnInit } from '@angular/core';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';

declare let $: any;

@Component({
  selector: 'app-add-survey',
  templateUrl: './add-survey.component.html',
  styleUrls: ['./add-survey.component.css']
})
export class AddSurveyComponent implements OnInit {

  constructor() { }

  openModal() {
    $('.modal').modal({
      dismissible: true,
      opacity: 0.6,
      inDuration: 300,
      outDuration: 200,
      startingTop: '35%',
      endingTop: '25%',
    });
  }

  closeModal() {
    $('#modalQuestion').modal('close');
  }

  ngOnInit() {

    /* Funcão para ocultar/mostrar blocos de opções das perguntas */
    $(function() {

      $("#testeDeleteVetor").bind("click", function(){
        levantamento.splice(0,1);
        console.log(levantamento);
      });

      // Iniciar o documento com os blocos de opções de respostas e tipo de gráfico ocultos.
      $(document).ready(function() {
        $('#answer-options, #chart-options').hide();
      })

      /* Caso o usuário selecione a opção de somente uma resposta ou várias respostas, mostrar o bloco de respostas e o tipo de gráfico  */
      $('#oneSelect, #multipleSelect').bind('focus', function() {
        $('#answer-options, #chart-options').show('slow');
      })

      /* Caso o usuário selecione a opção de selecionar uma classificação, ocultar o bloco de opções de resposta */
      $('#evaluation').bind('focus', function() {
        $('#answer-options').hide('slow');
        $('#chart-options').show('slow');
      });    

      /* Caso o usuário selecione a opção de digitar uma resposta, ocultar os blocos de opções de resposta e tipo de gráfico */
      $('#dissertative').bind('focus', function() {
        $('#answer-options, #chart-options').hide('slow');
      });

      /* Clone das resposta, para adicionar novos inputs*/
      $(document).ready(function(){
        var elm_html = $('#answer-block').html();   //faz uma cópia dos elementos a serem clonados.
  
        $(document).on('click', '#clonador', function(e){
            e.preventDefault();
            var i = $('.clone').length;    //pega a quantidade de clones;
            var elementos = elm_html.replace(/\[[0\]]\]/g, '['+i+++']');  //substitui o valor dos index e incrementa++
            $('#answer-block').append(elementos);  //exibe o clone.
        });
      });
    });
    /* Fim da funcão para ocultar/mostrar blocos de opções das perguntas */

    // Criando o vetor para armazenar o levantamento completo.
    var levantamento = [];

    /* Função Adicionar nova pergunta */
    var cont = 0;
    $(function(){

      $(document).on('click', '#adicionar-pergunta', function(){

        // Resgata o valor da pergunta
        var titulo = $('#title').val();

        //Resgata o valor do tipo de pergunta e com base nisso gera uma frase a ser exibida
        var tipoPerguntaValor = $('input:radio[name=questionType]:checked').val();

        if (tipoPerguntaValor != null || tipoPerguntaValor != undefined) {
          
          if (tipoPerguntaValor == "oneSelect") {
            var tipoPergunta = "O usuário pode selecionar somente uma opção de resposta.";
          } 
          else if(tipoPerguntaValor == "multipleSelect") {
            var tipoPergunta = "O usuário pode selecionar várias opções de resposta.";
          }
          else if(tipoPerguntaValor == "evaluation") {
            var tipoPergunta = "O usuário pode selecionar uma classificação.";
          }
          else {
            var tipoPergunta = "O usuário pode digitar uma resposta";
          }

        }

        // Resgata os valores das possíveis respostas da pergunta e armazena em um vetor
        var size = $('.clone').length;
        var resposta = [];

        for(var i = 0; i < size; i++) {
            resposta[i] = $(".answerOption:eq(" + i + ")").val();
        }
        
        //Resgata o valor do tipo de gráfico de resultados e com base nisso gera uma frase a ser exibida
        var chartTypeValor = $('input:radio[name=chartType]:checked').val();

        if(chartTypeValor != null || chartTypeValor !== undefined) {

          if (chartTypeValor == "pieChart") {
            var chartType = "Gráfico de pizza.";
          }
          else if (chartTypeValor == "horizontalBarChart") {
            var chartType = "Gráfico de barras na horizontal.";
          }
          else{
            var chartType = "Gráfico de barras na vertical.";
          }

        }

        //Inserindo a pergunta no vetor de levantamento
        var pergunta = {
          'titulo': titulo,
          'tipo': tipoPerguntaValor,
          'respostas': resposta,
          'grafico': chartTypeValor
        };

        levantamento.push(pergunta);
        console.log(levantamento);
        

        //Gerando código HTML dinâmicamente
        $('<div>', {
          id: "question" + cont,
          class: "question col s12"
        }).appendTo('.questions-created-container');

        $('<p>', {
          id: "question-created" + cont,
          class: "question-created"
        }).appendTo("#question" + cont);

        $('<p>', {
          id: "question-type-created" + cont,
          class: "question-type-created"
        }).appendTo("#question" + cont);

        // Cria o bloco de código para exibição do tipo de gráfico somente se o tipo de pergunta não for dissertative.
        if ((tipoPerguntaValor != "dissertative") && (tipoPerguntaValor != null) && (tipoPerguntaValor != undefined)) {
          
          $('<p>', {
            id: "chart-type-created" + cont,
            class: "chart-type-created"
          }).appendTo("#question" + cont);

        }

        // Se o tipo de pergunta for multipla escolha (tanto para uma opção de resposta quanto para várias), adicionar campo para mostrar as respostas cadastradas
        if (tipoPerguntaValor == "oneSelect" || tipoPerguntaValor == "multipleSelect") {

          $('<div>', {
            id: "answers-created" + cont,
            class: "answers-created"
          }).appendTo("#question" + cont);

          $('<div>', {
            id: "answers-list" + cont,
            class: "answers-list"
          }).appendTo("#answers-created" + cont);
        }

        $('<i>', {
          id: "delete" + cont,
          class: "delete"
        }).appendTo("#question" + cont);

        $("#delete" + cont).html("delete");
        // Fim do gerador de código HTML

        // Atribuindo valores da pergunta aos campos HTML
        if (titulo != null && titulo != undefined) {
          $("#question-created" + cont).html("<span class='bold'> Pergunta: </span>" + titulo);
        }

        if (tipoPergunta != null && tipoPergunta != undefined) {
          $("#question-type-created" + cont).html("<span class='bold'> Tipo de pergunta: </span>" + tipoPergunta);
        }
        
        // Exibe o tipo de gráfico somente se o tipo de pergunta não for dissertative
        if ((tipoPerguntaValor != "dissertative") && (tipoPerguntaValor != null) && (tipoPerguntaValor != undefined)) {
          $("#chart-type-created" + cont).html("<span class='bold'> Tipo de gráfico de resultados: </span>" + chartType);
        }

        // Exibe as possíveis respostas da pergunta somente se o tipo de pergunta for multipla escolha (tanto para uma opção de resposta quanto para várias)
        if (tipoPerguntaValor == "oneSelect" || tipoPerguntaValor == "multipleSelect") {
          $.each(resposta, function(key, value) {
            $("#answers-list" + cont).append(value  + "<br>");
          })

          //Função para expandir/recolher respostas
          $('<span>', {
            class: "expand-collapse-questions" + cont
          }).appendTo("#answers-created" + cont);

          $(".expand-collapse-questions" + cont).html(">>>>> Mostrar perguntas <<<<<");

          $("#answers-list" + cont).toggle();

          $(".expand-collapse-questions" + cont).click(function(){
            $("answers-list" + cont).toggle();
            $(".expand-collapse-questions" + cont).html(">>>>> Ocultar perguntas <<<<<");
          });
        }

        // Resetar o form após cadastrar uma pergunta
        $('#form-questions').each (function(){
          this.reset();
          // voltar para corrigir essa lógica
          for(var i = -1000; i <= size; i++) {
            $(".clone:eq(" + i + ")").remove();
          }

          $('#answer-options, #chart-options').hide();
        });

        $("#delete0").bind("click", function(){
          $("#question0").remove();
        })

        $("#delete1").bind("click", function(){
          $("#question1").remove();
        })

        $("#delete2").bind("click", function(){
          $("#question2").remove();
        })

        $("#delete3").bind("click", function(){
          $("#question3").remove();
        })

        $("#delete4").bind("click", function(){
          $("#question4").remove();
        })

        $("#delete5").bind("click", function(){
          $("#question5").remove();
        })

        $("#delete6").bind("click", function(){
          $("#question6").remove();
        })

        $("#delete7").bind("click", function(){
          $("#question7").remove();
        })

        $("#delete8").bind("click", function(){
          $("#question8").remove();
        })

        $("#delete9").bind("click", function(){
          $("#question9").remove();
        })

        $("#delete10").bind("click", function(){
          $("#question10").remove();
        })

        cont++;

      })
      
    })

  }

}

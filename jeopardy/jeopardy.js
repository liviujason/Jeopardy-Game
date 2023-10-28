
const $div = $('#div-wrapper');
const $restart = $('#restart-btn');
const $gameTable = $('table');
const $headRow = $('thead');
const $tableBody = $('tbody');
const $row1 = $('table > thead > tr > th');
const $col1 = $('table > tbody > tr > td:nth-of-type(1)');
const $col2 = $('table > tbody > tr > td:nth-of-type(2)');
const $col3 = $('table > tbody > tr > td:nth-of-type(3)');
const $col4 = $('table > tbody > tr > td:nth-of-type(4)');
const $col5 = $('table > tbody > tr > td:nth-of-type(5)');
const $col6 = $('table > tbody > tr > td:nth-of-type(6)');
const $allTds = $('table > tbody > tr > td');


$(document).ready(function() {
   setupAndStart();
   setTimeout(() => {
      $restart.click(function() {
         $(this).prop('disabled', true);
         $('td').each(function() {
            $(this).val('');
            $(this).text('?');
         })
         $('body').append("<div id='blocker' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000;'></div>");
         setTimeout(function() {
            $('#blocker').remove();
         }, 6500);
         setupAndStart();
         setTimeout(() => {
            $(this).prop('disabled', false);
         },15000);
      });
   }, 15000);
});


async function setupAndStart() {

   $gameTable.attr('id', 'game-wrapper');
   $headRow.addClass('table-head');
   $tableBody.addClass('table-body');

   const categories = await axios.get('http://jservice.io/api/categories', {params: {offset: 55, count: 23}});
   const categoriesData = categories.data;

   let categoriesIds = [];
   let categoriesTitle = [];
   for(let i = 0; i < categoriesData.length; i++){
      let ids = categoriesData[i];
      let titles = categoriesData[i];
      categoriesIds.push(ids.id);
      categoriesTitle.push(titles.title);
   }

   let almostData = [];
   if(categoriesIds.length === 23){
      for(let i = 0; i < categoriesIds.length; i++){
         const category = await axios.get('http://jservice.io/api/category', {params: {id: categoriesIds[i]}}); 
         const arrClues = category.data.clues;
         almostData.push(arrClues);
      }
   }  

   let data = categoriesTitle.map((name, index) => {
      return {title : name, clues : almostData[index]};
   });

   data = data.map(item => {
      return {
         title: item.title,
         clues: item.clues.map(clue => {
            const {question, answer} = clue;
            return {question, answer, showing: null};
         })
      }
   });
   fillTable(data);
}


function fillTable(data) {

   for(let i = data.length-1; i > 0; i--){
      let j = Math.floor(Math.random() * (i + 1));
      [data[i], data[j]] = [data[j], data[i]];
   }

   data.forEach(item => {
      if(item.clues && Array.isArray(item.clues)){
         for(let i = item.clues.length-1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            [item.clues[i], item.clues[j]] = [item.clues[j], item.clues[i]];  
         }
      }
   });

   $row1.eq(0).val(data[0]).text(data[0].title);
   $row1.eq(1).val(data[1]).text(data[1].title);
   $row1.eq(2).val(data[2]).text(data[2].title);
   $row1.eq(3).val(data[3]).text(data[3].title);
   $row1.eq(4).val(data[4]).text(data[4].title);
   $row1.eq(5).val(data[5]).text(data[5].title);

   const colOneQs = data[0].clues;
   const colTwoQs = data[1].clues;
   const colThreeQs = data[2].clues;
   const colFourQs = data[3].clues;
   const colFiveQs = data[4].clues;
   const colSixQs = data[5].clues;
   

   $col1.eq(0).val(colOneQs[0]);
   $col1.eq(1).val(colOneQs[1]);
   $col1.eq(2).val(colOneQs[2]);
   $col1.eq(3).val(colOneQs[3]);
   $col1.eq(4).val(colOneQs[4]);

   $col2.eq(0).val(colTwoQs[0]);
   $col2.eq(1).val(colTwoQs[1]);
   $col2.eq(2).val(colTwoQs[2]);
   $col2.eq(3).val(colTwoQs[3]);
   $col2.eq(4).val(colTwoQs[4]);

   $col3.eq(0).val(colThreeQs[0]);
   $col3.eq(1).val(colThreeQs[1]);
   $col3.eq(2).val(colThreeQs[2]);
   $col3.eq(3).val(colThreeQs[3]);
   $col3.eq(4).val(colThreeQs[4]);

   $col4.eq(0).val(colFourQs[0]);
   $col4.eq(1).val(colFourQs[1]);
   $col4.eq(2).val(colFourQs[2]);
   $col4.eq(3).val(colFourQs[3]);
   $col4.eq(4).val(colFourQs[4]);

   $col5.eq(0).val(colFiveQs[0]);
   $col5.eq(1).val(colFiveQs[1]);
   $col5.eq(2).val(colFiveQs[2]);
   $col5.eq(3).val(colFiveQs[3]);
   $col5.eq(4).val(colFiveQs[4]);

   $col6.eq(0).val(colSixQs[0]);
   $col6.eq(1).val(colSixQs[1]);
   $col6.eq(2).val(colSixQs[2]);
   $col6.eq(3).val(colSixQs[3]);
   $col6.eq(4).val(colSixQs[4]);
}

$($tableBody).on('click', $($allTds), function(evt) {
   const target = evt.target;
   if(target.value.showing === null){
      target.innerText = target.value.question;
      target.value.showing = target.value.question;
   } else if(target.value.showing === target.value.question){
      target.innerText = target.value.answer;
      target.value.showing = target.value.answer;
   } else if(target.value.showing === target.value.answer){
      target.innerText = target.value.showing;
   }
});





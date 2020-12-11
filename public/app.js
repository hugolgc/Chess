$(() => {


  const pieces = [
    { nom: 'pion', couleur: 'blanc', positions: ['1a2', '2b2', '3c2', '4d2', '5e2', '6f2', '7g2', '8h2']},
    { nom: 'pion', couleur: 'noir', positions: ['1a7', '2b7', '3c7', '4d7', '5e7', '6f7', '7g7', '8h7']},
    { nom: 'tour', couleur: 'blanc', positions: ['1a1', '2h1']},
    { nom: 'tour', couleur: 'noir', positions: ['1a8', '2h8']},
    { nom: 'cavalier', couleur: 'blanc', positions: ['1b1', '2g1']},
    { nom: 'cavalier', couleur: 'noir', positions: ['1b8', '2g8']},
    { nom: 'fou', couleur: 'blanc', positions: ['1c1', '2f1']},
    { nom: 'fou', couleur: 'noir', positions: ['1c8', '2f8']},
    { nom: 'dame', couleur: 'blanc', positions: ['1d1']},
    { nom: 'dame', couleur: 'noir', positions: ['1d8']},
    { nom: 'roi', couleur: 'blanc', positions: ['1e1']},
    { nom: 'roi', couleur: 'noir', positions: ['1e8']}
  ]

  
  const socket = io()
  const numbers_blanc = [8, 7, 6, 5, 4, 3, 2, 1]
  const numbers_noir = [1, 2, 3, 4, 5, 6, 7, 8]
  const letters_blanc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const letters_noir = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
  const main = $('main')
  let pseudo = adversaire = ''
  var tourner = box = coup = 0


  $('form').submit(e => {
    e.preventDefault()
    pseudo = $('#pseudo').val()
    adversaire = $('#adversaire').val()
    tourner = $('#tourner').val()
    $('form').attr('class', 'hidden')
    $('main').attr('class', 'grid grid-cols-8 border-8 border-gray-700')


    if (tourner == 'blanc') {
      numbers_blanc.map(number => {
        letters_blanc.map(letter => {
          if ((box % 2) === 0) {
            main.append(`<div id="${ letter + number }" class="h-20 w-20 bg-gray-100"></div>`)
          } else {
            main.append(`<div id="${ letter + number }" class="h-20 w-20 bg-gray-500"></div>`)
          } box++
        })
        box--
      })
    } else {
      numbers_noir.map(number => {
        letters_noir.map(letter => {
          if ((box % 2) === 0) {
            main.append(`<div id="${ letter + number }" class="h-20 w-20 bg-gray-100"></div>`)
          } else {
            main.append(`<div id="${ letter + number }" class="h-20 w-20 bg-gray-500"></div>`)
          } box++
        })
        box--
      })
    }


    pieces.map(piece => {
      piece.positions.map(position => {
        $(`#${ position.substring(1, 3) }`).append(`<img id="${ position }" src="${ piece.nom }_${ piece.couleur }.png" alt="${ piece.nom }_${ piece.couleur }">`)
      })
    })


    img = $('img')
    img.draggable()
    img.mousedown(e => {
      coup = {
        id: e.target.id, 
        alt: e.target.alt
      }
    })


    $('div').droppable({
      drop: e => {
        socket.emit('deplacement', {
          receveur: adversaire,
          piece: { id: coup.id, alt: coup.alt },
          position: e.target.id
        })
        play(coup, e.target.id)
      }
    })
  })


  const play = (piece, coords) => {
    $(`#${ piece.id }`).remove()
    $(`#${ coords }`).empty().html(`<img id="${ piece.id }" src="${ piece.alt }.png" alt="${ piece.alt }">`)
    $(`#${ piece.id }`).draggable()
    $(`#${ piece.id }`).mousedown(e => {
      coup = {
        id: e.target.id, 
        alt: e.target.alt
      }
    })
  }


  socket.on('deplacement', data => {
    if (data.receveur === pseudo) {
      play(data.piece, data.position)
    }
  })


})
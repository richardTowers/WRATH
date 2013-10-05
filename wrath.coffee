(->
  menu = document.getElementById 'menu'
  menuLink = document.getElementById 'menuLink'
  layout = document.getElementById 'layout'
  toggleClass = (element, className) ->
    classes = element.className.split /\s+/
    length = classes.length
    i = 0
    while i < length
      if classes[i] is className
        classes.splice i, 1
        break
      i++
    classes.push className  if length is classes.length
    element.className = classes.join ' '

  menuLink.onclick = (e) ->
    e.preventDefault()
    active = 'active'
    toggleClass layout, active
    toggleClass menu, active
    toggleClass menuLink, active
)()
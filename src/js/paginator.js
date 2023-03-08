function paginationLaunch() {
  function getPageList(totalPages, page, maxLength) {
    function range(start, end) {
      return Array.from(Array(end - start + 1), (_, i) => i + start);
    }
    let sideWidth = maxLength < 9 ? 1 : 2;
    let leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    let rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

    if (totalPages <= maxLength) {
      return range(1, totalPages);
    }

    if (page <= maxLength - sideWidth - 1 - rightWidth) {
      return range(1, maxLength - sideWidth - 1).concat(
        0,
        range(totalPages - sideWidth + 1, totalPages)
      );
    }

    if (page >= totalPages - sideWidth - 1 - rightWidth) {
      return range(1, sideWidth).concat(
        0,
        range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages)
      );
    }
    return range(1, sideWidth).concat(
      0,
      range(page - leftWidth, page + rightWidth),
      0,
      range(totalPages - sideWidth + 1, totalPages)
    );
  }

  $(function () {
    let numberOfItem = $('.gallery .photo-card').length;
    let limitPerPage = 2;
    let totalPages = Math.ceil(numberOfItem / limitPerPage);
    let paginationSize = 7;
    if (window.screen.width <= 767) {
      paginationSize = 5;
    }

    let currentPage;
    function showPage(whichPage) {
      if (whichPage < 1 || whichPage > totalPages) return false;
      currentPage = whichPage;

      $('.gallery .photo-card')
        .hide()
        .slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage)
        .show();
      $('.pagination li').slice(1, -1).remove();

      getPageList(totalPages, currentPage, paginationSize).forEach(item => {
        $('<li>')
          .addClass('page-item')
          .addClass(item ? 'current-page' : 'dots')
          .toggleClass('active', item === currentPage)
          .append(
            $('<a>')
              .addClass('page-link')
              .attr({ href: 'javascript:void(0)' })
              .text(item || '...')
          )
          .insertBefore('.next-page');
      });

      $('.previuos-page').toggleClass('disable', currentPage === 1);
      $('.next-page').toggleClass('disable', currentPage === totalPages);
      return true;
    }

    $('.pagination').append(
      $('<li>')
        .addClass('page-item')
        .addClass('previuos-page')
        .append(
          $('<svg>')
            .addClass('page__svg--prev')
            .append(
              $('<use>').attr({
                href: './images/NextPrev.svg#icon-Prev',
              })
            )
        )
        .append(
          $('<a>')
            .addClass('page-link')
            .attr({ href: 'javascript:void(0)' })
            .text('Prev')
        ),

      $('<li>')
        .addClass('page-item')
        .addClass('next-page')
        .append(
          $('<a>')
            .addClass('page-link')
            .attr({ href: 'javascript:void(0)' })
            .text('Next')
        )
        .append(
          $('<svg>')
            .addClass('page__svg--next')
            .append(
              $('<use>').attr({
                href: './images/NextPrev.svg#icon-Next',
              })
            )
        )
    );

    $('.gallery').show();
    showPage(1);

    $(document).on(
      'click',
      '.pagination li.current-page:not(.active)',
      function () {
        return showPage(+$(this).text());
      }
    );

    $('.next-page').on('click', function () {
      if (currentPage === totalPages) {
        pageNumber++;
      } else {
        return showPage(currentPage + 1);
      }
    });
    $('.previuos-page').on('click', function () {
      return showPage(currentPage - 1);
    });
  });
}

export { paginationLaunch };

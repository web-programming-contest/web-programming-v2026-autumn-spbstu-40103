import leftArrowIcon from '../../assets/images/home-page/left-arrow.svg';
import rightArrowIcon from '../../assets/images/home-page/right-arrow.svg';

function Pagination({
  currentPage,
  setCurrentPage,
  countOfPages,
  pages,
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  countOfPages: number;
  pages: (number | '...')[];
}) {
  return (
    <div className="pagination">
      {currentPage > 1 && (
        <img
          src={leftArrowIcon}
          className="arrow"
          alt="arrow left icon"
          onClick={() => setCurrentPage(currentPage - 1)}
        />
      )}

      {pages.map((page, i) =>
        page === '...' ? (
          <div
            key={`dots-${i}`}
            className="pagination-item dots"
            onClick={() => setCurrentPage(i === 1 ? 1 : countOfPages)}
          >
            <span>…</span>
          </div>
        ) : (
          <div
            key={page}
            className={`pagination-item ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            <span>{page}</span>
          </div>
        ),
      )}

      {currentPage < countOfPages && (
        <img
          src={rightArrowIcon}
          className="arrow"
          alt="arrow right icon"
          onClick={() => setCurrentPage(currentPage + 1)}
        />
      )}
    </div>
  );
}

export default Pagination;

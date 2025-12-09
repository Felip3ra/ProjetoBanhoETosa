using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoBanhoETosa.Domain.Repository
{
    public interface IRepository<T>
    {
        Task<IEnumerable<T?>> GetAll();
        Task<T?> GetById(int id);
        Task<T?> GetByCondition(Expression<Func<T, bool>> predicate);
        Task<bool> Add(T entity);
        Task<bool> Update(T entity);
        Task<bool> Delete(int id);
    }
}

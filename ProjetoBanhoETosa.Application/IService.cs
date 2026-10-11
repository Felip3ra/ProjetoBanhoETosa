using ProjetoBanhoETosa.Application.DTO;
using ProjetoBanhoETosa.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ProjetoBanhoETosa.Application
{
    public interface IService<TDto, TEntity>
    {
        Task<TDto?> GetByIdAsync(int id); 
        Task<IEnumerable<TDto>> GetAllAsync();
        Task<bool> AddAsync(TDto entity);
        Task<bool> UpdateAsync(TDto entity);
        Task<bool> DeleteAsync(int id);
        Task<TDto?> GetByCondition(Expression<Func<TEntity, bool>> predicate);
    }
}

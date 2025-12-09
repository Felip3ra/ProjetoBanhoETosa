using Microsoft.EntityFrameworkCore;
using ProjetoBanhoETosa.Domain.Repository;
using ProjetoBanhoETosa.Infrastructure.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ProjetoBanhoETosa.Infrastructure.Repository
{

    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly AppDbContext _context;
        public Repository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<bool> Add(T entity)
        {
            try
            {
                await _context.Set<T>().AddAsync(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> Delete(int id)
        {
            try
            {
                var entity = await _context.Set<T>().FindAsync(id);
                if (entity == null) return false;

                _context.Set<T>().Remove(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }


        public async Task<IEnumerable<T?>> GetAll()
        {
            try
            {
                return await _context.Set<T>().ToListAsync();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<T?> GetByCondition(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return await _context.Set<T>().FirstOrDefaultAsync(predicate);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<T?> GetById(int id)
        {
            try
            {
                var entity = await _context.Set<T>().FindAsync(id);
                if (entity == null) return null;

                return entity;


            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> Update(T entity)
        {
            try
            {
                _context.Set<T>().Update(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
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
                var entry = _context.Entry(entity);
                if (entry.State == EntityState.Detached)
                {
                    var entityType = _context.Model.FindEntityType(typeof(T));
                    var keyProperties = entityType?.FindPrimaryKey()?.Properties;
                    if (keyProperties != null && keyProperties.Count > 0)
                    {
                        var localEntity = _context.Set<T>().Local.FirstOrDefault(local => KeysMatch(local, entity, keyProperties));
                        if (localEntity != null)
                        {
                            _context.Entry(localEntity).State = EntityState.Detached;
                        }
                    }
                    _context.Set<T>().Attach(entity);
                }

                entry.State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private static bool KeysMatch(T left, T right, IReadOnlyList<IProperty> keyProperties)
        {
            foreach (var keyProperty in keyProperties)
            {
                var propertyInfo = keyProperty.PropertyInfo;
                if (propertyInfo == null) return false;

                var leftValue = propertyInfo.GetValue(left);
                var rightValue = propertyInfo.GetValue(right);
                if (leftValue == null || rightValue == null) return false;
                if (!leftValue.Equals(rightValue)) return false;
            }

            return true;
        }
    }
}

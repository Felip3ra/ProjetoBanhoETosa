using AutoMapper;
using ProjetoBanhoETosa.Domain.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ProjetoBanhoETosa.Application
{
    public class Service<TDto, TEntity> : IService<TDto, TEntity>
        where TDto : class
        where TEntity : class
    {
        private readonly IMapper _mapper;
        private readonly IRepository<TEntity> _repository;
        private static bool TypesAreEqual => typeof(TDto) == typeof(TEntity);

        public Service(IMapper mapper, IRepository<TEntity> repository)
        {
            _mapper = mapper;
            _repository = repository;
        }

        public async Task<bool> AddAsync(TDto dto)
        {
            var entity = MapToEntity(dto);
            return await _repository.Add(entity);
        }

        public async Task<IEnumerable<TDto>> GetAllAsync()
        {
            var entities = await _repository.GetAll();
            return MapToDtoList(entities);
        }

        public async Task<TDto?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetById(id);
            return MapToDto(entity);
        }

        public async Task<TDto?> GetByCondition(Expression<Func<TEntity, bool>> predicate)
        {
            var entity = await _repository.GetByCondition(predicate);
            return MapToDto(entity);
        }

        public async Task<bool> UpdateAsync(TDto dto)
        {
            var entity = MapToEntity(dto);
            return await _repository.Update(entity);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.Delete(id);
        }

        private TEntity MapToEntity(TDto dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));
            return TypesAreEqual ? (TEntity)(object)dto : _mapper.Map<TEntity>(dto);
        }

        private TDto? MapToDto(TEntity? entity)
        {
            if (entity == null) return default;
            return TypesAreEqual ? (TDto)(object)entity : _mapper.Map<TDto>(entity);
        }

        private IEnumerable<TDto> MapToDtoList(IEnumerable<TEntity?> entities)
        {
            if (entities == null) return Enumerable.Empty<TDto>();
            if (TypesAreEqual)
                return entities.Where(e => e != null).Select(e => (TDto)(object)e!);

            return _mapper.Map<IEnumerable<TDto>>(entities);
        }

    }
}

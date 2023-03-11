// import custom error not found dan bad request
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { NotFoundError, BadRequestError } = require('../../errors');

// const getAllRoles = async (req) => {
// 	const { keyword } = req.query;

// 	let condition = { organizer: req.user.organizer };

// 	if (keyword) {
// 		condition = { ...condition, name: { $regex: keyword, $options: 'i' } };
// 	}

// 	const result = await Roles.find(condition)
// 		// seperti join, refrensi dari image, dan nampilin id,name,role,image
// 		.populate({
// 			path: 'image',
// 			select: '_id name',
// 		})
// 		.select('_id name role image');

// 	return result;
// };

const createRoles = async (req) => {
	const { nama } = req.body;

	let check = await prisma.role.findFirst({
		where: {
			AND: [{ nama }],
		},
	});

	if (check) throw new BadRequestError('pembicara sudah terdaftar');

	const result = await prisma.role.create({
		data: {
			nama,
		},
	});

	return result;
};

// const getOneRoles = async (req) => {
// 	const { id } = req.params;

// 	const result = await Roles.findOne({
// 		_id: id,
// 		organizer: req.user.organizer,
// 	})
// 		// .populate('image') nampilin semuanya termasuk image juga
// 		.populate({
// 			path: 'image',
// 			select: '_id name',
// 		})
// 		.select('_id name role image');

// 	if (!result)
// 		throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

// 	return result;
// };

// const updateRoles = async (req) => {
// 	const { id } = req.params;
// 	const { name, image, role } = req.body;

// 	// cari image dengan field image
// 	await checkingImage(image);

// 	// cari talents dengan field name dan id selain dari yang dikirim dari params
// 	const check = await Roles.findOne({
// 		name,
// 		organizer: req.user.organizer,
// 		_id: { $ne: id },
// 	});

// 	// apa bila check true / data talents sudah ada maka kita tampilkan error bad request dengan message pembicara sudah terdaftar
// 	if (check) throw new BadRequestError('pembicara sudah terdaftar');

// 	const result = await Roles.findOneAndUpdate(
// 		{ _id: id },
// 		{ name, image, role, organizer: req.user.organizer },
// 		{ new: true, runValidators: true }
// 	);

// 	// jika id result false / null maka akan menampilkan error `Tidak ada pembicara dengan id` yang dikirim client
// 	if (!result)
// 		throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

// 	return result;
// };

// const deleteRoles = async (req) => {
// 	const { id } = req.params;

// 	const result = await Roles.findOne({
// 		_id: id,
// 		organizer: req.user.organizer,
// 	});

// 	if (!result)
// 		throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

// 	await result.remove();

// 	return result;
// };

// const checkingRoles = async (id) => {
// 	const result = await Roles.findOne({ _id: id });

// 	if (!result)
// 		throw new NotFoundError(`Tidak ada pembicara dengan id :  ${id}`);

// 	return result;
// };

module.exports = {
	createRoles,
	// getAllRoles,
	// getOneRoles,
	// updateRoles,
	// deleteRoles,
	// checkingRoles,
};
